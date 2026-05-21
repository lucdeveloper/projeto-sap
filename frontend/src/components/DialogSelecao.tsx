import { Dialog,Button, Bar, Ui5CustomEvent } from "@ui5/webcomponents-react";
import { ReactNode } from "react";
import { FilterBarPage } from "./FilterBarPage";

export function DialogSelecao({ open, onClose, textoDialog, filters, children, onGo, onConfirm }:{
    open: boolean;
    onClose: () => void;
    textoDialog: string;
    filters?: ReactNode;
    children?: ReactNode;
    onGo: (event: Ui5CustomEvent<any, any>) => void;
    onConfirm?: (data?: any) => void;
}) {

  return (    
    <Dialog 
      style={{ height: "100%" }}
      stretch
      resizable
      waitForDefine
      open={open}
      footer={
        <Bar 
          design="Footer" 
          endContent={
            <>
              {onConfirm && (
                <Button design="Emphasized" onClick={() => onConfirm([])}>
                  Selecionar
                </Button>
              )}
              <Button design="Transparent" onClick={onClose}>Fechar</Button>
            </>
          }/>
      }
      headerText={textoDialog}
    >
    
    <FilterBarPage 
      titulo={textoDialog} 
      onFilterBar={onGo}
      filters={filters}
      children={children} 
    />
    
    </Dialog>
    
  );
}