import { Avatar, Button, NavigationLayout, ShellBar, SideNavigation , SideNavigationItem } from "@ui5/webcomponents-react";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";


export function Navegacao( ) {
   const [hideMenu, setHideMenu] = useState(false);
   const navigate = useNavigate();

    const menu = [
        { label: "Configuração de anexo", path: "/anexo", icon: "enablement" },
        { label: "Pedidos de venda", path: "/", icon: "sales-quote" }
    ];

    return(
        <div
            style={{
                height: '100%',
                position: 'relative'
            }}
            >
            <NavigationLayout
                header={
                    <ShellBar
                        logo={<img alt="SAP Logo" src="https://ui5.github.io/webcomponents/images/sap-logo-svg.svg" /> }    
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
                        startButton={
                            <Button icon="menu" onClick={() => setHideMenu(prev => !prev)}/>
                        }
                    />
                }
                sideContent={
                    !hideMenu && (
                        <SideNavigation slot="sideContent">
                            { menu.map(item => (
                                <SideNavigationItem
                                    icon={item.icon}
                                    text={item.label}
                                    onClick={() => navigate(item.path)}
                                    />
                                ))
                            }
                        </SideNavigation>
                    )
                }
            >
                <Outlet />
            </NavigationLayout>
            </div>
    )
}