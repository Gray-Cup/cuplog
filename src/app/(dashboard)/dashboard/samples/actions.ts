"use server";

import { unstable_cache, revalidateTag, revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { sample } from "@/lib/db/schema";
import { getUser } from "@/lib/auth-utils";
import { eq, and, desc } from "drizzle-orm";

export type SampleRow = typeof sample.$inferSelect;

// Each user gets their own cache tag — mutations invalidate only that user's data.
function samplesTag(userId: string) {
  return `samples:${userId}`;
}

export async function getSamples(): Promise<SampleRow[]> {
  const user = await getUser();
  if (!user) return [];

  return unstable_cache(
    async () =>
      db
        .select()
        .from(sample)
        .where(eq(sample.userId, user.id))
        .orderBy(desc(sample.createdAt)),
    [`samples-${user.id}`],
    { tags: [samplesTag(user.id)] }
  )();
}

export async function getDashboardStats(): Promise<{
  total: number;
  cupped: number;
  avgScore: number | null;
  thisMonth: number;
}> {
  const user = await getUser();
  if (!user) return { total: 0, cupped: 0, avgScore: null, thisMonth: 0 };

  return unstable_cache(
    async () => {
      const rows = await db
        .select()
        .from(sample)
        .where(eq(sample.userId, user.id));

      const cupped = rows.filter((r) => r.status === "complete");
      const scores = cupped
        .map((r) => (r.finalScore ? parseFloat(r.finalScore) : null))
        .filter((s): s is number => s !== null);
      const avgScore = scores.length
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : null;

      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const thisMonth = rows.filter(
        (r) => new Date(r.createdAt) >= monthStart
      ).length;

      return { total: rows.length, cupped: cupped.length, avgScore, thisMonth };
    },
    [`stats-${user.id}`],
    { tags: [samplesTag(user.id)] }  // same tag — mutations bust stats too
  )();
}

export async function createSample(data: {
  name: string;
  origin: string;
  variety: string;
  process: string;
  roast: string;
  photos: string[];
}): Promise<SampleRow> {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const now = new Date();
  const [row] = await db
    .insert(sample)
    .values({
      id: crypto.randomUUID(),
      userId: user.id,
      name: data.name.trim(),
      origin: data.origin.trim() || "—",
      variety: data.variety.trim() || "—",
      process: data.process.trim() || "—",
      roast: data.roast.trim() || "—",
      dateReceived: now.toISOString().slice(0, 10),
      status: "pending",
      photos: data.photos,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  revalidateTag(samplesTag(user.id), "default");
  revalidatePath("/dashboard");
  return row;
}

export async function saveCuppingSession(
  id: string,
  scores: {
    fragrance: string;
    flavor: string;
    aftertaste: string;
    acidity: string;
    body: string;
    balance: string;
    overall: string;
    uniformity: string;
    cleanCup: string;
    sweetness: string;
    taints: string;
    faults: string;
    notes: string;
  },
  descriptors: { label: string; family: string; attrKey?: string }[],
  finalScore: number
): Promise<void> {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  await db
    .update(sample)
    .set({
      ...scores,
      descriptors,
      finalScore: String(finalScore),
      status: "complete",
      updatedAt: new Date(),
    })
    .where(and(eq(sample.id, id), eq(sample.userId, user.id)));

  revalidateTag(samplesTag(user.id), "default");
  revalidatePath("/dashboard");
}

export async function updateSamplePhotos(
  id: string,
  photos: string[]
): Promise<void> {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  await db
    .update(sample)
    .set({ photos, updatedAt: new Date() })
    .where(and(eq(sample.id, id), eq(sample.userId, user.id)));

  revalidateTag(samplesTag(user.id), "default");
}

export async function deleteSample(id: string): Promise<void> {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  await db
    .delete(sample)
    .where(and(eq(sample.id, id), eq(sample.userId, user.id)));

  revalidateTag(samplesTag(user.id), "default");
  revalidatePath("/dashboard");
}
