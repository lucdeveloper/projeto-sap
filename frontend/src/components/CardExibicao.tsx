import { Card, CardHeader, Icon, List, ListItemStandard } from "@ui5/webcomponents-react";

interface ItemCard {
  titulo: string;
  descricao: string;
}

interface CardExibicaoProps {
  titulo: string;
  itens: ItemCard[];
}


export function CardExibicao({ titulo, itens }: CardExibicaoProps) {
  return (
    <Card
      header={
        <CardHeader
          avatar={<Icon name="person-placeholder" />}
          titleText={titulo}
        />
      }
      style={{ width: "300px" }}
    >
      <List>
        {itens.map((item, index) => (
          <ListItemStandard
            key={index}
            text={item.titulo}
            description={item.descricao}
          />
        ))}
      </List>
    </Card>
  );
}