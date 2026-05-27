import {
    Dialog,
    Bar,
    Button,
    Text
} from "@ui5/webcomponents-react";

type DialogMensagemProps = {
    open: boolean;
    titulo: string;
    mensagem: string;
    tipo?:  "None" | "Positive" | "Critical" | "Negative" | "Information" | undefined;
    onClose: () => void;
};

export function DialogMensagem({ open, titulo, mensagem, tipo , onClose }: DialogMensagemProps) {

    return (
        <Dialog
            open={open}
            headerText={titulo}
            state={tipo}
            onClose={onClose}
            footer={
                <Bar
                    endContent={
                        <Button onClick={onClose}>
                            Fechar
                        </Button>
                    }
                />
            }
        >
            <div>

                <Text>
                    {mensagem}
                </Text>

            </div>
        </Dialog>
    );
}