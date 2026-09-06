export type Phase = {
  id: string;
  number: number;
  slug: string;
  title: string;
  subtitle: string;
  code: string;
  content: string;
  clue: string;
  hint: string;
  type: "Código" | "Senha" | "Enigma" | "Texto" | "Imagem" | "Link";
  status: "draft" | "live";
  unlock: "manual" | "date" | "previous";
  unlockAt: string;
  accent: string;
};

export const defaultPhases: Phase[] = [
  {
    id: "1",
    number: 1,
    slug: "dia-01",
    title: "Bom dia, Boo",
    subtitle: "Você encontrou a primeira porta.",
    code: "bomdia",
    content: "Algumas histórias começam com uma pergunta. A nossa começa com um bom dia.",
    clue: "Uma palavra simples, mas escrita sem espaço.",
    hint: "Pense em como você normalmente me deseja um bom dia.",
    type: "Senha",
    status: "live",
    unlock: "manual",
    unlockAt: "",
    accent: "#f5c2e7"
  },
  {
    id: "2",
    number: 2,
    slug: "a-primeira-pista",
    title: "A primeira pista",
    subtitle: "Nem tudo precisa ser dito diretamente.",
    code: "boo",
    content: "Procure o detalhe que parece estar fora do lugar.",
    clue: "Leia as primeiras letras.",
    hint: "Começo também é uma pista.",
    type: "Enigma",
    status: "draft",
    unlock: "previous",
    unlockAt: "",
    accent: "#cba6f7"
  }
];
