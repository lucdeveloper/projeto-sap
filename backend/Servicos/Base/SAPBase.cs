using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using sap.Configuracoes;
using System.Data.Common;
using System.Data.Odbc;
using System.Net;
using System.Text;

namespace sap.Servicos.Base;

public class SAPBase(HttpClient httpClient, IOptions<SAPConfiguracoes> configuracoes, IOptions<StringConexaoConfiguracao> stringConexao)
{
    private readonly HttpClient _httpClient = httpClient;
    private readonly SAPConfiguracoes _configuracoes = configuracoes.Value;
    private readonly StringConexaoConfiguracao _stringConexao = stringConexao.Value;

    public async Task LoginAsync()
    {
        var loginData = new
        {
            _configuracoes.CompanyDB,
            _configuracoes.UserName,
            _configuracoes.Password
        };

        var json = JsonConvert.SerializeObject(loginData);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        var response = await _httpClient.PostAsync(SAPRotas.Login, content);

        if (!response.IsSuccessStatusCode)
            throw new Exception("Erro ao logar no SAP Service Layer");
    }

    public async Task<T> CriarRegistro<T>(string url, object data)
    {
        var conteudo = CriarConteudo(data);
        var resposta = await _httpClient.PostAsync(url, conteudo);

        if (resposta.StatusCode == HttpStatusCode.Unauthorized)
        {
            await LoginAsync();
            conteudo = CriarConteudo(data);
            resposta = await _httpClient.PostAsync(url, conteudo);
        }

        var resultado = await resposta.Content.ReadAsStringAsync();

        if (!resposta.IsSuccessStatusCode) 
            throw new Exception(resultado);

        var objeto = JsonConvert.DeserializeObject<T>(resultado);

        if (objeto == null) throw new Exception(resultado);

        return objeto;
    }

    public async Task AtualizarRegistro(string url, object data, bool replaceCollectionsOnPatch = false)
    {
        HttpRequestMessage CriarRequisicao()
        {
            var req = new HttpRequestMessage(new HttpMethod("PATCH"), url) { Content = CriarConteudo(data) };
            if (replaceCollectionsOnPatch) req.Headers.Add("B1S-ReplaceCollectionsOnPatch", "true");
            return req;
        }

        var requisicao = CriarRequisicao();
        var resposta = await _httpClient.SendAsync(requisicao);

        if (resposta.StatusCode == HttpStatusCode.Unauthorized)
        {
            await LoginAsync();
            requisicao = CriarRequisicao();
            resposta = await _httpClient.SendAsync(requisicao);
        }

        var resultado = await resposta.Content.ReadAsStringAsync();

        if (!resposta.IsSuccessStatusCode)
            throw new Exception(resultado);
    }

    public async Task<T?> Query<T>(string query, Func<DbDataReader, T> mapeamento)
    {
        using var conexao = new OdbcConnection(_stringConexao.HanaConnection);
        await conexao.OpenAsync();

        using var comando = new OdbcCommand(query, conexao);

        var reader = await comando.ExecuteReaderAsync();

        if (reader == null)
            return default;

        if (await reader.ReadAsync())
            return mapeamento(reader);

        return default;
    }

    public async Task<List<T>> QueryParam<T>(string query, List<OdbcParameter>? parametros, Func<DbDataReader, T> mapeamento)
    {
        var lista = new List<T>();

        using var conexao = new OdbcConnection(_stringConexao.HanaConnection);
        await conexao.OpenAsync();

        using var comando = new OdbcCommand(query, conexao);

        if(parametros is not null)
            parametros.ForEach(parametro => comando.Parameters.Add(parametro));

        using var reader = await comando.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            var item = mapeamento(reader);
            lista.Add(item);
        }

        return lista;
    }

    public async Task<T?> QuerySingle<T>(string query, OdbcParameter parametro, Func<DbDataReader, T> mapeamento)
    {
        using var conexao = new OdbcConnection(_stringConexao.HanaConnection);
        await conexao.OpenAsync();

        using var comando = new OdbcCommand(query, conexao);
       
        if (parametro != null)
            comando.Parameters.Add(parametro);

        using var reader = await comando.ExecuteReaderAsync();

        if (await reader.ReadAsync())
            return mapeamento(reader);

        return default;
    }

    private StringContent CriarConteudo(object data)
    {
        var json = JsonConvert.SerializeObject(data, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
        return new StringContent(json, Encoding.UTF8, "application/json");
    }
}
