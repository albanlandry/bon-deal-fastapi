// app/layout.tsx
import "./global.css";
import { ReactNode } from "react";

export const metadata = {
    title: "Marketplace",
    description: "Local Marketplace App",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-gray-100 text-gray-900">
                <div className="container mx-auto p-4">{children}</div>
            </body>
        </html>
    );
}