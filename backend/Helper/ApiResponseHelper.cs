using sap.Servicos.ApiResponse;

namespace sap.Helper
{
    public static class ApiResponseHelper
    {
        public static ApiResponse<T> Ok<T>(T data, string message = "OK")
        {
            return new ApiResponse<T>
            {
                Success = true,
                Code = 0,
                Message = message,
                Data = data
            };
        }

        public static ApiResponse<T> Fail<T>(int code, string message)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Code = code,
                Message = message,
                Data = default
            };
        }
    }
}
