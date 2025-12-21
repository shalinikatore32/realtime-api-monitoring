import LayoutWrapper from "@/components/custom/LayoutWrapper";
import ProtectedRoute from "@/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <LayoutWrapper>{children}</LayoutWrapper>
    </ProtectedRoute>
  );
}
