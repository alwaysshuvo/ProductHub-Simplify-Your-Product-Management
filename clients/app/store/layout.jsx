import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "ProductHub. - Store Dashboard",
    description: "ProductHub. - Store Dashboard",
};

export default function StoreRootLayout({ children }) {
    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
