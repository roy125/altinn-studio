﻿using System.Net;
using System.Net.Http;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using Designer.Tests.Utils;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using SharedResources.Tests;
using Xunit;

namespace Designer.Tests.Controllers.AppDevelopmentController
{
    public class SaveFormLayoutTestsBase : AppDevelopmentControllerTestsBase<SaveFormLayoutTestsBase>
    {
        public SaveFormLayoutTestsBase(WebApplicationFactory<Altinn.Studio.Designer.Controllers.AppDevelopmentController> factory) : base(factory)
        {
        }

        [Theory]
        [InlineData("ttd", "empty-app", "testUser", "testLayout", "TestData/App/ui/layoutWithUnknownProperties.json")]
        [InlineData("ttd", "empty-app", "testUser", "testLayout", "TestData/App/ui/changename/layouts/form.json")]
        [InlineData("ttd", "empty-app", "testUser", "testLayout", "TestData/App/ui/changename/layouts/summary.json")]
        [InlineData("ttd", "empty-app", "testUser", "testLayout", "TestData/App/ui/datalist/layouts/formLayout.json")]
        [InlineData("ttd", "empty-app", "testUser", "testLayout", "TestData/App/ui/datalist/layouts/summary.json")]
        [InlineData("ttd", "empty-app", "testUser", "testLayout", "TestData/App/ui/group/layouts/hide.json")]
        [InlineData("ttd", "empty-app", "testUser", "testLayout", "TestData/App/ui/group/layouts/prefill.json")]
        [InlineData("ttd", "empty-app", "testUser", "testLayout", "TestData/App/ui/group/layouts/repeating.json")]
        [InlineData("ttd", "empty-app", "testUser", "testLayout", "TestData/App/ui/group/layouts/summary.json")]
        [InlineData("ttd", "empty-app", "testUser", "testLayout", "TestData/App/ui/likert/layouts/formLayout.json")]
        [InlineData("ttd", "empty-app", "testUser", "testLayout", "TestData/App/ui/message/layouts/formLayout.json")]
        public async Task SaveFormLayout_ReturnsOk(string org, string app, string developer, string layoutName, string layoutPath)
        {
            string targetRepository = TestDataHelper.GenerateTestRepoName();
            CreatedFolderPath = await TestDataHelper.CopyRepositoryForTest(org, app, developer, targetRepository);

            string url = $"{VersionPrefix(org, targetRepository)}/form-layout/{layoutName}";

            string layout = SharedResourcesHelper.LoadTestDataAsString(layoutPath);

            using var httpRequestMessage = new HttpRequestMessage(HttpMethod.Post, url)
            {
                Content = new StringContent(layout, Encoding.UTF8, MediaTypeNames.Application.Json)
            };

            using var response = await HttpClient.Value.SendAsync(httpRequestMessage);
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            string savedLayout = TestDataHelper.GetFileFromRepo(org, targetRepository, developer, $"App/ui/layouts/{layoutName}.json");
            JsonUtils.DeepEquals(layout, savedLayout).Should().BeTrue();
        }

    }
}
