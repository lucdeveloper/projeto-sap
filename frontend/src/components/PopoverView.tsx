import {Label, ResponsivePopover, Text } from "@ui5/webcomponents-react";
import { PopoverItem } from "../interfaces/PopoverItem";

export function PopoverView({ open, opener, onClose, texto, data = []}: {
  open: boolean;
  opener: string | HTMLElement | null | undefined;
  onClose: () => void;
  texto: string;
  data: PopoverItem[];
}) {

  return (
    <ResponsivePopover
        className="footerPartNoPadding"
        headerText={texto}
        horizontalAlign="Center"
        placement="End"  
        open={open}
        opener={opener}
        onClose={onClose}
        verticalAlign="Center"
        onFocus={(e) => {
              e.stopPropagation();
        }}
    > 

    <div style={{ minWidth: "300px" }}>

      {data.map((item, index) => (
         <div  key={index} style={{ display: "flex", flexDirection: "column",gap: "4px", marginBottom: "10px" }}>
          <Label showColon={true}>
              {`${item.label}`}
          </Label>
          <Text>{`${item.value}`}</Text> 
         </div>        
      ))}

    </div>

    </ResponsivePopover>
    
  );
}