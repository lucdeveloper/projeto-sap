import {
  Bar,
  Title,
  Form,
  FormGroup,
  FormItem,
  Text,
  Label,
  BusyIndicator,
} from "@ui5/webcomponents-react";
import { useAnexoContext } from "../../contexts/anexoContext";

export function Anexo() {
  const { anexo, loading } = useAnexoContext();

  return (
    <BusyIndicator 
      active={loading} 
      size="M" 
      style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        width: '100%',
        boxSizing: 'border-box'
      }}>

        <Bar 
          design="Header"
          startContent={
            <Title size="H4">
              Configurações de anexo
            </Title>
          }
        />
        <div
          style={{
            flex: 1,
            padding: "2rem",
            overflowY: 'auto',
            boxSizing: 'border-box'
          }}
        >
          <Form layout="S1 M2 L2 XL2" labelSpan="S12 M12 L12 XL12">
            <FormGroup headerText="Anexos">
              <FormItem labelContent={<Label>Pasta padrão:</Label>}>
                  <Text>{anexo?.caminhoPastaAnexo}</Text>
              </FormItem>
            </FormGroup>
          </Form>
        </div>
      </div>
    </BusyIndicator>
  );
}