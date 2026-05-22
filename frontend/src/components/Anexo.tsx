import {
  Bar,
  Button,
  Title,
  Form,
  FormGroup,
  FormItem,
  Text,
  Label,
  BusyIndicator,
  Input
} from "@ui5/webcomponents-react";
import { useAnexo } from "../hooks/useAnexo";
import { useEffect, useState } from "react";

export function Anexo() {
  const { anexo, loading, carregarAnexo } = useAnexo();
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    carregarAnexo();
  }, []);

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
          endContent={
            !editMode && (
              <Button
                design="Emphasized"
                style={{
                  height: "1.625rem",
                  minWidth: "2rem"
                }}
                onClick={() => setEditMode(true)}
              >
                Processar
              </Button>
            )
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
                {editMode ? (
                  <Input value={anexo?.caminhoPastaAnexo} style={{ width: '100%' }} />
                ) : (
                  <Text>{anexo?.caminhoPastaAnexo}</Text>
                )}
              </FormItem>
            </FormGroup>
          </Form>
        </div>

        {editMode && (
            <div style={{ padding: "0 0.5rem 0.5rem 0.5rem", width: '100%', boxSizing: 'border-box' }}>
              <Bar 
                design="FloatingFooter" 
                style={{
                  width: '100%',
                }}
                endContent={
                  <>
                    <Button design="Emphasized">Atualização</Button>
                    <Button design="Transparent" onClick={() => setEditMode(false)}>Cancelar</Button>
                  </>
                }
              />
            </div>
          )
        }
        
      </div>
    </BusyIndicator>
  );
}