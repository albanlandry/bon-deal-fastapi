import '../globals.css';
import { AdminLayoutProps } from "./admin-layout";
import AdminLayout from "./admin-layout";
import { ChakraProvider } from "@chakra-ui/react";

const Layout: FC<AdminLayoutProps> = ({ children }: any) => {
    return <ChakraProvider>
        <AdminLayout>{children}</AdminLayout>;
    </ChakraProvider>
};

export default Layout;