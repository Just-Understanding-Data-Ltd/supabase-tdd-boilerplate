import { Database } from "../database.types";
type Tables = Database["public"]["Tables"];
type Enums = Database["public"]["Enums"];
export type DatabaseFunctions = {
    create_organization: {
        Args: Database["public"]["Functions"]["create_organization"]["Args"];
        Returns: {
            organization: Tables["organizations"]["Row"];
            team: Tables["teams"]["Row"];
        };
    };
    invite_org_member: {
        Args: Database["public"]["Functions"]["invite_org_member"]["Args"];
        Returns: string;
    };
    validate_invitation_token: {
        Args: Database["public"]["Functions"]["validate_invitation_token"]["Args"];
        Returns: {
            id: string;
            email: string;
            organization_id: string;
            role: Enums["onboarding_role_type"];
            membership_type: Enums["membership_type"];
            expires_at: string;
            organizations: {
                name: string;
            };
        };
    };
    revoke_invitation: {
        Args: Database["public"]["Functions"]["revoke_invitation"]["Args"];
        Returns: boolean;
    };
    process_invitation: {
        Args: Database["public"]["Functions"]["process_invitation"]["Args"];
        Returns: boolean;
    };
    add_org_member_to_all_teams: {
        Args: Record<string, never>;
        Returns: Tables["organization_members"]["Row"];
    };
    add_team_members_to_new_team: {
        Args: Record<string, never>;
        Returns: Tables["teams"]["Row"];
    };
};
export {};
