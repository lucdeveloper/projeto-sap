using LGSapB1.CreateTable;
using SAPbobsCOM;

namespace B1PlusCreateTables
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
            // TABELA PAI
            CreateUpdate_UserTables("LGODPEDIDOVENDA", "Pedido de Venda", BoUTBTableType.bott_Document);
            CreateUpdate_UserFields("@LGODPEDIDOVENDA", "DocEntryPedido", "DocEntry Pedido", BoFieldTypes.db_Numeric, BoFldSubTypes.st_None, 11);

            // TABELA FILHA
            CreateUpdate_UserTables("LGOLDPEDIDOVENDEDOR", "Vendedores do Pedido", BoUTBTableType.bott_DocumentLines);
            CreateUpdate_UserFields("@LGOLDPEDIDOVENDEDOR", "VendedorCode", "Código do vendedor", BoFieldTypes.db_Numeric, BoFldSubTypes.st_None, 10);

            // REGISTRO DO UDO
            RegisterOrUpdate_Objects(
                sCode: "LGODPEDIDOVENDA",
                sName: "Pedido Venda Vendedores",
                eManageSeries: BoYesNoEnum.tNO,
                eCanCancel: BoYesNoEnum.tNO,
                eCanDelete: BoYesNoEnum.tYES,
                eCanFind: BoYesNoEnum.tNO,
                eCanCreateDefaultForm: BoYesNoEnum.tNO,
                eObjectType: BoUDOObjType.boud_Document,
                bUpdateIfExists: false,
                ChildTables: new string[] { "LGOLDPEDIDOVENDEDOR" }
            );
        }        
    }
}
