import {
  Bar,
  Button,
  Title,
  Form,
  FormGroup,
  FormItem,
  Text,
  Label
} from "@ui5/webcomponents-react";

export function Anexo() {
  return (
    <div>

      {/* HEADER */}
      <Bar 
        design="Header"
        startContent={
          <Title size="H4">
            Configurações de anexo
          </Title>
        }
        endContent={
            <Button
              design="Emphasized"
              style={{
                height: "1.625rem",
                minWidth: "2rem"
              }}
            >
              Processar
            </Button>
        }
      />

      {/* FORMULÁRIO */}
      <div
        style={{
          padding: "2rem"
        }}
      >
        <Form layout="S1 M2 L2 XL2" labelSpan="S12 M12 L12 XL12">
          <FormGroup headerText="Anexos">

            <FormItem labelContent={<Label>Pasta padrão:</Label>}>
              <Text>Teste</Text>
            </FormItem>

          </FormGroup>
        </Form>
      </div>

    </div>
  );
}