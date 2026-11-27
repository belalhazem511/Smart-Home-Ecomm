namespace SmartHomeEcomm.Domain.Localization;

public static class ErrorMessages
{
    private static readonly Dictionary<string, (string En, string Ar)> Templates = new()
    {
        [ErrorCodes.Unauthorized] = (
            "You need to be logged in to do that. Your session may have expired — log in again.",
            "يجب تسجيل الدخول أولًا. قد تكون جلستك قد انتهت — سجّل الدخول مجددًا."),

        [ErrorCodes.Forbidden] = (
            "You don't have permission to do that.",
            "ليس لديك صلاحية للقيام بذلك."),

        [ErrorCodes.NotFound] = (
            "We couldn't find '{0}'. It may have been deleted.",
            "تعذّر العثور على '{0}'. ربما تم حذفه."),

        [ErrorCodes.BadRequest] = (
            "The request was invalid.",
            "الطلب غير صالح."),

        [ErrorCodes.TooManyRequests] = (
            "Too many requests. Please slow down and try again.",
            "طلبات كثيرة جدًا. يرجى الانتظار والمحاولة مجددًا."),

        [ErrorCodes.ServerError] = (
            "Something went wrong on our side. Please try again in a moment.",
            "حدث خطأ من جهتنا. حاول مجددًا بعد قليل."),

        [ErrorCodes.RouteNotFound] = (
            "The page you're looking for doesn't exist. Check the address and try again.",
            "الصفحة التي تبحث عنها غير موجودة. تحقق من العنوان وحاول مجددًا."),

        [ErrorCodes.ValidationError] = (
            "Some fields need your attention before we can continue.",
            "بعض الحقول تحتاج إلى مراجعتك قبل المتابعة."),

        [ErrorCodes.FieldRequired] = (
            "'{0}' is required.",
            "حقل '{0}' مطلوب."),

        [ErrorCodes.InvalidValue] = (
            "'{0}' has an invalid value.",
            "قيمة حقل '{0}' غير صالحة."),

        [ErrorCodes.EmailTaken] = (
            "This email address is already registered. Try signing in instead.",
            "هذا البريد الإلكتروني مسجّل بالفعل. حاول تسجيل الدخول بدلًا من ذلك."),

        [ErrorCodes.InvalidCredentials] = (
            "The email or password you entered is incorrect.",
            "البريد الإلكتروني أو كلمة المرور غير صحيحة."),

        [ErrorCodes.EmailNotVerified] = (
            "Your email address isn't verified yet. Check your inbox for the verification code.",
            "لم يتم تأكيد بريدك الإلكتروني بعد. تحقق من صندوق الوارد للحصول على رمز التأكيد."),

        [ErrorCodes.OtpInvalid] = (
            "The code you entered is incorrect.",
            "الرمز الذي أدخلته غير صحيح."),

        [ErrorCodes.OtpExpired] = (
            "This code has expired. Request a new one and try again.",
            "انتهت صلاحية هذا الرمز. اطلب رمزًا جديدًا وحاول مجددًا."),

        [ErrorCodes.ResetInvalid] = (
            "This reset request is invalid or has expired. Start again.",
            "طلب الاستعادة غير صالح أو انتهت صلاحيته. ابدأ من جديد."),
    };

    public static string Get(string code, string locale, params object?[] args)
    {
        if (!Templates.TryGetValue(code, out var template))
            template = Templates[ErrorCodes.ServerError];

        var text = locale == "ar" ? template.Ar : template.En;
        return args.Length == 0 ? text : string.Format(text, args);
    }

    public static string ResolveLocale(string? locale) =>
        string.Equals(locale?.Trim(), "ar", StringComparison.OrdinalIgnoreCase) ? "ar" : "en";
}
