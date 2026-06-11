using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LGSapB1.CreateTable;
using SAPbobsCOM;

namespace CREATETABLE
{
    internal class Program : CreateTable
    {        
        public Program() : base(TipoAddOn.Nenhum)
        {
        }

        static void Main(string[] args)
        {            
          Program program = new Program();               
        }

        public override void Configure_Data()
        {           
            AddOnName = "CREATETABLE - Criação de Tabelas";
            AddOnVersion = "1.0.0";
            ComponentsCount = 1;
            IsDebug = true; 
            QuestionCreateDefaultViews = false;           
        }

        public override void Create_Components(CompanyDataConnection p)
        {
            // Tipos de tabela registradas. Pode ser usado na SL. Cria uma rota com o mesmo nome do registro do objeto.
            // Cadastro -> Master data (topo), Master data Lines (linhas do cadastro)
            // Documento -> Document (topo), Document Lines (linhas do documento)

            // NoObject -> Tabela sem objeto registrado. Criadas em situações que controlamos via CRUD manualmente. Não é possível utilizar via SL
            // NoObject Auto Increment -> igual a anterior, porémno SQL ela incrementava automaticamente o Code. No HANA não funciona corretamente. praticamente não usamos esse tipo. 

            // Nomenclaturas de tabelas.
            // Topo de cadastro -> LGOC.... LGO = Namespace da Lago, C = tipo do objeto
            // Linha de cadastro -> LGOLC.... LGO = Namespace da Lago, LC = Linha do tipo do objeto

            // Topo de documento -> LGOD.... LGO = Namespace da Lago, D = tipo do objeto
            // Linha de documento -> LGOLD.... LGO = Namespace da Lago, LD = Linha do documento

            // Nomenclatura de campos.
            // Campos criados em tabelas que criamos não possuem LGO.
            // Campos criados em tabelas do core POSSUEM LGO.
            //
            // Exemplos abaixo
           
            Remove_UserTables("LGODPEDIDOVENDEDOR");

            // TABELA PAI
            CreateUpdate_UserTables("LGOPEDIDOVENDA", "Pedido de Venda", BoUTBTableType.bott_Document);
            CreateUpdate_UserFields("@LGOPEDIDOVENDA", "DocEntryPedido", "DocEntry Pedido", BoFieldTypes.db_Numeric, BoFldSubTypes.st_None, 11);

            // TABELA FILHA
            CreateUpdate_UserTables("LGDPEDIDOVENDEDOR", "Vendedores do Pedido", BoUTBTableType.bott_DocumentLines);
            CreateUpdate_UserFields("@LGDPEDIDOVENDEDOR", "VendedorCode", "Código do vendedor", BoFieldTypes.db_Numeric, BoFldSubTypes.st_None, 10);

            // REGISTRO DO UDO
            RegisterOrUpdate_Objects(
                sCode: "LGOPEDIDOVENDA",
                sName: "Pedido Venda Vendedores",
                eManageSeries: BoYesNoEnum.tNO,
                eCanCancel: BoYesNoEnum.tNO,
                eCanDelete: BoYesNoEnum.tYES,
                eCanFind: BoYesNoEnum.tNO,
                eCanCreateDefaultForm: BoYesNoEnum.tNO,
                eObjectType: BoUDOObjType.boud_Document,
                bUpdateIfExists: false,
                ChildTables: new string[] { "LGDPEDIDOVENDEDOR" }
            );

            //CreateUpdate_UserFields("ORDR", "LGO_CampoORDR", "Descrição campo", BoFieldTypes.db_Alpha, BoFldSubTypes.st_None, 50);
            //// Após criar o campo, no banco ele ficará automaticamente com U_ para identificar que é um campo criado por addons. neste caso acima no banco firaria U_LGO_CampoORDR

            //CreateUpdate_UserTables("LGOCTABELACADASTRO", "LGO: Tabela", BoUTBTableType.bott_MasterData);
            //CreateUpdate_UserFields("@LGOCTABELACADASTRO", "CampoTexto", "Descrição texto", BoFieldTypes.db_Alpha, BoFldSubTypes.st_None, 50);
            //CreateUpdate_UserFields("@LGOCTABELACADASTRO", "CampoValor", "Descrição valor", BoFieldTypes.db_Float, BoFldSubTypes.st_Price, 11);
            //CreateUpdate_UserFields("@LGOCTABELACADASTRO", "CampoData", "Descrição data", BoFieldTypes.db_Date, BoFldSubTypes.st_None, 10);
            //// No banco vão ficar U_CampoTexto, U_CampoValor, U_CampoData por exemplo.


            //CreateUpdate_UserTables("LGOLCTABELACADASTRO", "LGO: Tabela linha", BoUTBTableType.bott_MasterDataLines);
            //CreateUpdate_UserFields("@LGOLCTABELACADASTRO", "CampoFilho", "Descrição filho", BoFieldTypes.db_Alpha, BoFldSubTypes.st_None, 50);

            //this.RegisterOrUpdate_Objects(sCode: "LGOCTABELACADASTRO",
            //    sName: "LGOCTABELACADASTRO",
            //    eManageSeries: SAPbobsCOM.BoYesNoEnum.tNO,
            //    eCanCancel: SAPbobsCOM.BoYesNoEnum.tNO,
            //    eCanDelete: SAPbobsCOM.BoYesNoEnum.tNO, 
            //    eCanFind: SAPbobsCOM.BoYesNoEnum.tYES, // permite pesquisar igual nas telas do core
            //    eCanCreateDefaultForm: SAPbobsCOM.BoYesNoEnum.tNO, // Cria um formulário padrão no SAP. se marcar yes precisa definir o tipo e colunas do form em outra propriedade
            //    eObjectType: SAPbobsCOM.BoUDOObjType.boud_MasterData, // Tipo do objeto. MasterData ou Document
            //    bUpdateIfExists: true, // flag de atualização do objeto, caso inclua mais tabelas e campos após sua criação, o objeto precisa ser atualizado
            //    ChildTables: new string[] { "LGOLCTABELACADASTRO" }, // tabelas filhas do objeto. pode ter várias tabelas
            //    findColumns: new string[] { "U_CampoTexto", "U_CampoValor", "U_CampoData" } // Campos de pesquisa do objeto. caso seja usada dentro do SAP e não tenha a coluna registrada aqui, a pesquisa não funciona pelo campo.
            //    //formColumns: new string[] new string[] { "U_CampoTexto", "U_CampoValor", "U_CampoData" }

            //);

            //// Comandos para criar as procedures e views no banco de dados automaticamente quando geramos uma versão do addon/portal.
            //Execute_Scripts("NomeDoScript_proc", LGSapB1.ScriptType.eProcedure);
            //Execute_Scripts("NomeDoScript_vw", LGSapB1.ScriptType.eView);
        }        
    }
}
