import { Avatar, Button, ShellBar, ShellBarItem } from "@ui5/webcomponents-react";
import { useNavigate } from "react-router-dom";

export function BarraNavegacao( ) {
  const navigate = useNavigate();

  return (
    <ShellBar
        logo={
          <img
            alt="SAP Logo"
            src="https://ui5.github.io/webcomponents/images/sap-logo-svg.svg"
          />
        }
        notificationsCount="10"
        primaryTitle="Business One"
        profile={
          <Avatar>
            <img
              alt="person"
              src="https://ui5.github.io/webcomponents-react/v2/assets/Person-B7wHqdJw.png"
            />
          </Avatar>
        }
        showNotifications
        startButton={<Button accessibleName="Back" icon="nav-back" tooltip="Back" onClick={() => navigate(-1)}/>}
      >
        <ShellBarItem icon="sys-help" text="Help" />
      </ShellBar>
  );
}