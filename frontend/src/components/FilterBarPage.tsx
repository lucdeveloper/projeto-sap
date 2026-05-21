import {
    DynamicPage, 
    DynamicPageHeader, 
    DynamicPageTitle, 
    FilterBar,  
    Ui5CustomEvent,  
    VariantItem, 
    VariantManagement,
} from "@ui5/webcomponents-react";

import React, { ReactNode } from "react";

interface FilterBarPageProps {
  titulo: string;
  onFilterBar?: (event: Ui5CustomEvent<any, any>) => void; 
  filters: ReactNode;
  children: ReactNode;
}

export function FilterBarPage( { titulo, onFilterBar, filters, children}: FilterBarPageProps) {

  function removerFragmentsDosFilhos(children: ReactNode): ReactNode[] {
    return React.Children.toArray(children).flatMap((child: any) => {
      if (child?.type === React.Fragment) {
        return removerFragmentsDosFilhos(child.props.children);
      }
      return child;
    });
  }


  return (
   
   <DynamicPage 
    className="no-page-scroll"
    style={{ height: "100%" }}
    hidePinButton
    headerArea={
        <DynamicPageHeader style={{padding: "0px"}}>
            <FilterBar
                hideFilterConfiguration
                showGoOnFB 
                hideToolbar
                onGo={onFilterBar}  
            >
               {removerFragmentsDosFilhos(filters)}
            </FilterBar>
        </DynamicPageHeader>}
       
     titleArea={
        <DynamicPageTitle  style={{padding: "0px"}}
          heading={
            <VariantManagement>
              <VariantItem selected>{titulo}</VariantItem>
            </VariantManagement>
          }
          snappedHeading={
            <VariantManagement>
              <VariantItem>{titulo}</VariantItem>
            </VariantManagement>
          }
          
        />
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            paddingBottom: "0.75rem",
            boxSizing: "border-box"
          }}
        >
          {children}
        </div>
      </div>
   
    </DynamicPage>
  );
}