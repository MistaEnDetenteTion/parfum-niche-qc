import { getClients, getClientsARelancer } from "@/app/actions/crm";
import { CrmDashboard } from "./crm-dashboard";

export const dynamic = "force-dynamic";

export default async function CrmPage() {
  const clients = await getClients();
  const aRelancer = await getClientsARelancer();

  return <CrmDashboard initialClients={clients} initialRelances={aRelancer} />;
}
