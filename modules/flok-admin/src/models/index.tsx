export type AdminRetreatListType = "active" | "inactive" | "complete"
export type AdminRetreatListModel = {
  id: number
  guid: string
  company_name: string
  contact_email: string
  preferences_num_attendees_lower: number
  flok_admin_state: string
  flok_admin_owner: string
  created_at: string
}
export type AdminRetreatDetailsModel = {
  id: number
  guid: string
  company_name: string
  contact_email: string
  preferences_num_attendees_lower: number
  flok_admin_state: string
}
export const RetreatStateOptions = [
  "Signed up",
  "Intake Call",
  "Follow up Sent",
  "Deposit Sent",
  "Deposit Paid",
  "Hotel Proposal Sourced",
  "Hotel Proposals Sent",
  "Hotel Contract Requested",
  "Hotel Contract To Client",
  "Full Invoice Sent",
  "Hotel Contract Signed",
  "Full Invoiced Paid",
  "Retreat Designer Handoff",
  "Retreat Complete",
  "Did not Sign Up",
  "Not Moving Forward",
  "Canceled",
  "No Show",
]
