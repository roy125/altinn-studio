﻿using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mime;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Altinn.Platform.Storage.Interface.Models;
using Designer.Tests.Utils;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Designer.Tests.Controllers.ApplicationMetadataController
{
    public class AddMetadataForAttachmentTests : ApplicationMetadataControllerTestsBase<AddMetadataForAttachmentTests>
    {

        public AddMetadataForAttachmentTests(WebApplicationFactory<Altinn.Studio.Designer.Controllers.ApplicationMetadataController> factory) : base(factory)
        {
        }

        [Theory]
        [MemberData(nameof(TestData))]
        public async Task AddMetadataForAttachment_WhenExists_ShouldReturnConflict(string org, string app, string developer, DataType payload)
        {
            string targetRepository = TestDataHelper.GenerateTestRepoName();
            CreatedFolderPath = await TestDataHelper.CopyRepositoryForTest(org, app, developer, targetRepository);

            string url = $"{VersionPrefix(org, targetRepository)}/attachment-component";

            // payload
            using var payloadContent = new StringContent(JsonSerializer.Serialize(payload, JsonSerializerOptions), Encoding.UTF8, MediaTypeNames.Application.Json);
            using var response = await HttpClient.Value.PostAsync(url, payloadContent);

            response.StatusCode.Should().Be(HttpStatusCode.OK);

            string applicationMetadataFile = await File.ReadAllTextAsync(Path.Combine(CreatedFolderPath, "App", "config", "applicationmetadata.json"));
            var applicationMetadata = JsonSerializer.Deserialize<Application>(applicationMetadataFile, JsonSerializerOptions);

            var attachmentDataType = applicationMetadata.DataTypes.Single(x => x.Id == payload.Id);
            attachmentDataType.MaxCount.Should().Be(payload.MaxCount);
            attachmentDataType.MaxSize.Should().Be(payload.MaxSize);
            attachmentDataType.MinCount.Should().Be(payload.MinCount);
        }

        /// <summary>
        /// Only 4 parameters are expected in a theory for payload
        /// </summary>
        public static IEnumerable<object[]> TestData => new List<object[]>
        {
            new object[]
            {
                "ttd", "hvem-er-hvem", "testUser", new DataType
                {
                    Id = "testId",
                    MaxCount = 1,
                    MaxSize = 25,
                    MinCount = 1
                }
            }
        };

    }
}
