/**
 * Layout de la sala de reuniones.
 * Sobrescribe el layout raíz para ocultar la navbar y sidebar.
 * La sala requiere pantalla completa sin navegación.
 */
export default function MeetingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // La sala de reunión no usa el layout principal (no navbar/sidebar)
  return <>{children}</>;
}
