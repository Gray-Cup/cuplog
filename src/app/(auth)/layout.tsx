export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between bg-[#F8F8F8] h-screen">
            <div className="w-full h-full flex items-start justify-center px-2 md:px-0">
                {children}
            </div>
        </div>
    );
}