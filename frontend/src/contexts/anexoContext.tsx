// contexts/AnexoContext.tsx

import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState
} from "react";

import { AnexoDTO } from "../interfaces/Anexo";

import { anexoService } from "../services/anexoService";
import { AnexoPedido } from "../interfaces/PedidosVenda";

type AnexoContextData = {
    anexo?: AnexoDTO;
    imagem?: string;
    mensagem?: string;
    loading: boolean;
    setMensagem: (mensagem?: string) => void;
    carregarAnexo: () => Promise<void>;
    consultaPorCodigo: ( codigo: number, numeroLinha: number) => Promise<string | undefined>;
    uploadAnexo: ( arquivo: File[] ) => Promise<void>; 
    arquivosUpload: AnexoPedido[];
    setArquivosUpload: (arquivos: AnexoPedido[]) => void;
    removerAnexos: (indexes: number[]) => void;
    exibirAnexo: (codigo: number, linha: number) => Promise<void>;

};

const AnexoContext = createContext( {} as AnexoContextData );

type Props = {children: ReactNode;};
    
export function AnexoProvider({  children}: Props) {

    const [anexo, setAnexo] = useState<AnexoDTO>();
    const [imagem, setImagem] = useState<string>();
    const [mensagem, setMensagem] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [arquivosUpload, setArquivosUpload] = useState<AnexoPedido[]>([]);
        
    const carregarAnexo = async () => {
        setLoading(true);
        setMensagem(undefined);

        try {
            const data = await anexoService.listar();
            setAnexo(data);
        } catch (error: any) {
            setMensagem( error?.response?.data?.mensagem?? "Erro ao carregar anexos.");
        } finally {
            setLoading(false);
        }
    };

    const consultaPorCodigo = async ( codigo: number, numeroLinha: number ) => {

        setLoading(true);
        setMensagem(undefined);

        try {

            const imagemUrl = await anexoService.consultar(codigo, numeroLinha);
            setImagem(imagemUrl);
            return imagemUrl;

        } catch (error: any) {
            setMensagem(error?.response?.data?.mensagem?? "Erro ao carregar imagem.");
        } finally {
            setLoading(false);
        }
    };

    const uploadAnexo = async (arquivos: File[]) => {

        try {

            const novosArquivos: AnexoPedido[] = arquivos.map((arquivo) => {
            const nome = arquivo.name.split(".")[0];
            const extensao = arquivo.name.split(".").pop() ?? "";

            return {
                caminhoDestino: anexo?.caminhoPastaAnexo ?? "",
                nomeArquivo: nome,
                extensaoArquivo: extensao,
                tamanhoArquivo: Math.floor(arquivo.size / 1024),
            };
        });

        setArquivosUpload(prev => [
            ...prev,
            ...novosArquivos
        ]);

        } catch {
            setMensagem("Erro ao adicionar arquivo.");
        }
    };

    const removerAnexos = (indexes: number[]) => {
        setArquivosUpload((prev) =>
            prev.filter((_: AnexoPedido, index: number) =>
                !indexes.includes(index)
            )
        );
    };

    const exibirAnexo = async (codigo: number, linha: number) => {
        const url = await consultaPorCodigo(codigo, linha);
        if (url) window.open(url, "_blank");
    };

    useEffect(() => {  carregarAnexo(); }, []);
       
    return (
        <AnexoContext.Provider
            value={{
                anexo,
                imagem,
                mensagem,
                loading,
                setMensagem,
                carregarAnexo,
                consultaPorCodigo,
                uploadAnexo,
                arquivosUpload,
                setArquivosUpload,
                removerAnexos,
                exibirAnexo
            }}
        >
            {children}

        </AnexoContext.Provider>
    );
}

export function useAnexoContext() {
    return useContext( AnexoContext );
}