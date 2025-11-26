import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "ProductHub. - Admin",
    description: "ProductHub. - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
