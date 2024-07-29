using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace DateTimeFormat
{
    public class DateOnlyConverter : JsonConverter<DateOnly>
    {
        private const string DateFormat = "yyyy-MM-dd";

        public override DateOnly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (DateOnly.TryParseExact(reader.GetString(), DateFormat, CultureInfo.InvariantCulture, DateTimeStyles.None, out var dateOnly))
            {
                return dateOnly;
            }
            throw new JsonException("Invalid date format.");
        }

        public override void Write(Utf8JsonWriter writer, DateOnly value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString(DateFormat));
        }
    }

}
