export const formatarDataBR = (data: string | null | undefined): string => {
    if (!data) return "";
    
    try {
        const [ano, mes, dia] = data.split('T')[0].split('-');
        return `${dia}/${mes}/${ano}`;
    } catch (error) {
        console.error("Erro ao formatar data:", data);
        return "";
    }
};

export const formatarDataISO = (data: string | null | undefined): string => {
    if (!data) return "";

    try {
        const dataLimpa = data.includes('T') ? data.split('T')[0] : data;

        if (dataLimpa.includes('/')) {
            const [dia, mes, ano] = dataLimpa.split('/');
            return `${ano}-${mes}-${dia}`;
        }

        return dataLimpa;
    } catch (error) {
        console.error("Erro ao formatar data para ISO:", data);
        return "";
    }
};