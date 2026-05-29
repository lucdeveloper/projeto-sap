import {
  Button,
  Dialog,
  Bar,
  Title,
  Carousel
} from "@ui5/webcomponents-react";

import { useState } from "react";

export function ColunaAnexos(instance: any) {
  const pedido = instance.row.original;;
  const [abrirAnexos, setAbrirAnexos] = useState(false);
  const anexos = pedido.anexoExibicao || [];

  return (
    <>
      <div
        style={{
          position: "relative",
          width: "fit-content"
        }}
      >
        {anexos.length > 0 && (
          <div
            style={{
                position: "absolute",
                top: -2,
                right: -2,
                background: "#d32f2f",
                color: "#fff",
                borderRadius: "50%",
                minWidth: 14,
                height: 14,
                padding: "0 2px",
                fontSize: 9,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 999,
                lineHeight: 1
                }}
          >
            {anexos.length}
          </div>
        )}

        <Button
          design="Transparent"
          disabled={anexos.length === 0}
          icon="attachment"
          onClick={(e: any) => {
            e.stopPropagation();

            if (anexos.length > 0) {
              setAbrirAnexos(true);
            }
          }}
        />
      </div>

      <Dialog
        open={abrirAnexos}
        onClose={() => setAbrirAnexos(false)}
        style={{
          width: "700px"
        }}
        header={
          <Bar
            startContent={<Title>Anexos</Title>}
            endContent={
              <Button
                design="Transparent"
                onClick={() => setAbrirAnexos(false)}
              >
                Fechar
              </Button>
            }
          />
        }
      >
       <Carousel
            onClick={(e) => e.stopPropagation()}
            style={{
                width: "100%",
                height: "500px"
            }}
        >
        {anexos.map((anexo: any, index: number) => {
            const isImagem = anexo.tipoArquivo?.startsWith("image");
            const isPdf = anexo.tipoArquivo?.includes("pdf");
            const isTexto = anexo.tipoArquivo === "text/plain";
            const isWord = anexo.tipoArquivo?.includes("word");
            const isExcel =  anexo.tipoArquivo?.includes("excel") ||  anexo.tipoArquivo?.includes("spreadsheet");
        return (
        <div
            key={index}
            style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            height: "100%",
            gap: "1rem",
            padding: "1rem"
            }}
        >
            {isImagem && (
            <img
                src={anexo.url}
                alt={anexo.nomeArquivo}
                style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain"
                }}
            />
            )}

            {isPdf && (
            <iframe
                src={anexo.url}
                title={anexo.nomeArquivo}
                style={{
                width: "100%",
                height: "100%",
                border: "none"
                }}
            />
            )}

            {isTexto && (
            <iframe
                src={anexo.url}
                title={anexo.nomeArquivo}
                style={{
                width: "100%",
                height: "100%",
                border: "1px solid #ccc",
                background: "white"
                }}
            />
            )}

            {isWord && (
            <>
                <div style={{ fontSize: "5rem" }}>
                📄
                </div>

                <Title level="H5">
                {anexo.nomeArquivo}
                </Title>

                <Button
                design="Emphasized"
                onClick={() =>
                    window.open(anexo.url, "_blank")
                }
                >
                Abrir documento
                </Button>
            </>
            )}

            {/* EXCEL */}
            {isExcel && (
            <>
                <div style={{ fontSize: "5rem" }}>
                📊
                </div>

                <Title level="H5">
                {anexo.nomeArquivo}
                </Title>

                <Button
                design="Emphasized"
                onClick={() =>
                    window.open(anexo.url, "_blank")
                }
                >
                Abrir planilha
                </Button>
            </>
            )}
        </div>
        );
    })}
       </Carousel>
      </Dialog>
    </>
  );
}