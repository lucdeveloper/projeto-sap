import { Avatar, Button, NavigationLayout, ShellBar, SideNavigation , SideNavigationItem, SideNavigationSubItem } from "@ui5/webcomponents-react";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";


export function Navegacao( ) {
   const [hideMenu, setHideMenu] = useState(true);
   const navigate = useNavigate();
   const exibirBotaoVoltar = location.pathname !== "/";

    const menu = [
        {
            id: 1,
            label: "Configuração de anexo",
            path: "/anexo",
            icon: "enablement"
        },
        {
            id: 2,
            label: "Vendas",
            icon: "sales-quote",
            children: [
                {
                    id: 3,
                    label: "Pedidos de venda",
                    path: "/"
                },
                {
                    id: 4,
                    label: "Criar pedido de venda",
                    path: "/pedido-venda"
                }
            ]
        }
    ];

    return(
        <div
           style={{
                height: '100vh',
                width: '100vw',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}
            >
            <NavigationLayout
                style={{ height: '100%' }}
                header={
                    <ShellBar
                        logo={<img alt="SAP Logo" src="https://ui5.github.io/webcomponents/images/sap-logo-svg.svg" /> }    
                        notificationsCount="10"
                        primaryTitle="Business One"
                        onClick={() => navigate("/")}
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
                            <>
                                {exibirBotaoVoltar && (
                                    <Button
                                        accessibleName="Back"
                                        icon="nav-back"
                                        tooltip="Back"
                                        onClick={() => navigate(-1)}
                                    />
                                )}
                                
                                <Button icon="menu" onClick={() => setHideMenu(prev => !prev)}/>
                            </>
                        }
                    />
                }
                sideContent={
                    !hideMenu && (
                        <SideNavigation slot="sideContent">
                            {menu.map(item => (
                                <SideNavigationItem
                                    key={item.id}
                                    icon={item.icon}
                                    text={item.label}
                                    onClick={() => {
                                        if (!item.children) {
                                            navigate(item.path);
                                        }
                                    }}
                                >
                                    {item.children?.map(subItem => (
                                        <SideNavigationSubItem
                                            key={subItem.id}
                                            text={subItem.label}
                                            onClick={() => navigate(subItem.path)}
                                        />
                                    ))}
                                </SideNavigationItem>
                            ))}
                        </SideNavigation>
                    )
                }
            >
                <Outlet />
            </NavigationLayout>
            </div>
    )
}