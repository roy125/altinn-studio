using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using Altinn.Studio.Designer.Configuration;
using Altinn.Studio.Designer.Factories;
using Altinn.Studio.Designer.Infrastructure.GitRepository;
using Altinn.Studio.Designer.Models;
using Altinn.Studio.Designer.Services.Implementation;
using Altinn.Studio.Designer.TypedHttpClients.AltinnStorage;
using Designer.Tests.Utils;
using FluentAssertions;
using Json.More;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Designer.Tests.Services;

public class TextsServiceTest : IDisposable
{

    public string CreatedTestRepoPath { get; set; }

    [Fact]
    public async Task UpdateRelatedFiles_KeyExistInLayoutInLayoutSet_ShouldFindNewId()
    {
        string org = "ttd";
        string repository = "app-with-layoutsets";
        string developer = "testUser";
        string layoutSetName = "layoutSet1";
        string layoutName = "layoutFile1InSet1.json";
        string targetRepository = TestDataHelper.GenerateTestRepoName();

        AltinnGitRepositoryFactory altinnGitRepositoryFactory = new(TestDataHelper.GetTestDataRepositoriesRootDirectory());
        TextsService textsService = GetTextsServiceForTest();
        CreatedTestRepoPath = await TestDataHelper.CopyRepositoryForTest(org, repository, developer, targetRepository);
        List<TextIdMutation> keyMutations = new() { new() { OldId = "some-old-id", NewId = "new-id" } };

        await textsService.UpdateRelatedFiles(org, targetRepository, developer, keyMutations);
        AltinnAppGitRepository altinnAppGitRepository = altinnGitRepositoryFactory.GetAltinnAppGitRepository(org, targetRepository, developer);
        JsonNode formLayout = await altinnAppGitRepository.GetLayout(layoutSetName, layoutName);

        formLayout.Should().NotBeNull();
        (formLayout["data"]["layout"] as JsonArray)[0]["textResourceBindings"]["title"].ToString().Should().Be("new-id");
    }

    [Fact]
    public async Task UpdateRelatedFiles_MultipleKeysExistInLayoutsAcrossLayoutSets_ShouldFindNewIdInMutlipleFiles()
    {
        string org = "ttd";
        string repository = "app-with-layoutsets";
        string developer = "testUser";
        string layoutSetName1 = "layoutSet1";
        string layoutSetName2 = "layoutSet2";
        string layoutName1 = "layoutFile1InSet1.json";
        string layoutName2 = "layoutFile1InSet2.json";
        string targetRepository = TestDataHelper.GenerateTestRepoName();


        CreatedTestRepoPath = await TestDataHelper.CopyRepositoryForTest(org, repository, developer, targetRepository);
        List<TextIdMutation> keyMutations = new() { new() { OldId = "some-old-id", NewId = "new-id" } };

        AltinnGitRepositoryFactory altinnGitRepositoryFactory = new(TestDataHelper.GetTestDataRepositoriesRootDirectory());
        TextsService textsService = GetTextsServiceForTest();
        await textsService.UpdateRelatedFiles(org, targetRepository, developer, keyMutations);
        AltinnAppGitRepository altinnAppGitRepository = altinnGitRepositoryFactory.GetAltinnAppGitRepository(org, targetRepository, developer);
        JsonNode formLayout1 = await altinnAppGitRepository.GetLayout(layoutSetName1, layoutName1);
        JsonNode formLayout2 = await altinnAppGitRepository.GetLayout(layoutSetName2, layoutName2);

        formLayout1.Should().NotBeNull();
        formLayout2.Should().NotBeNull();
        (formLayout1["data"]["layout"] as JsonArray)[0]["textResourceBindings"]["title"].ToString().Should().Be("new-id");
        (formLayout2["data"]["layout"] as JsonArray)[0]["textResourceBindings"]["title"].ToString().Should().Be("new-id");
    }

    [Fact]
    public async Task UpdateRelatedFiles_KeyExistInLayout_ShouldFindNewId()
    {
        string org = "ttd";
        string repository = "app-without-layoutsets";
        string developer = "testUser";
        string layoutSetName = null;
        string layoutName = "layoutFile1.json";
        string targetRepository = TestDataHelper.GenerateTestRepoName();

        AltinnGitRepositoryFactory altinnGitRepositoryFactory = new(TestDataHelper.GetTestDataRepositoriesRootDirectory());
        TextsService textsService = GetTextsServiceForTest();
        CreatedTestRepoPath = await TestDataHelper.CopyRepositoryForTest(org, repository, developer, targetRepository);
        List<TextIdMutation> keyMutations = new() { new() { OldId = "some-old-id", NewId = "new-id" } };

        await textsService.UpdateRelatedFiles(org, targetRepository, developer, keyMutations);
        AltinnAppGitRepository altinnAppGitRepository = altinnGitRepositoryFactory.GetAltinnAppGitRepository(org, targetRepository, developer);
        JsonNode formLayout = await altinnAppGitRepository.GetLayout(layoutSetName, layoutName);

        formLayout.Should().NotBeNull();
        (formLayout["data"]["layout"] as JsonArray)[0]["textResourceBindings"]["title"].ToString().Should().Be("new-id");
    }

    [Fact]
    public async Task UpdateRelatedFiles_KeyDoesNotExistInLayout_ShouldReturn()
    {
        string org = "ttd";
        string repository = "app-with-layoutsets";
        string developer = "testUser";
        string layoutSetName = "layoutSet1";
        string layoutName = "layoutFile1InSet1.json";
        string targetRepository = TestDataHelper.GenerateTestRepoName();

        AltinnGitRepositoryFactory altinnGitRepositoryFactory = new(TestDataHelper.GetTestDataRepositoriesRootDirectory());
        TextsService textsService = GetTextsServiceForTest();
        CreatedTestRepoPath = await TestDataHelper.CopyRepositoryForTest(org, repository, developer, targetRepository);

        List<TextIdMutation> keyMutations = new() { new() { OldId = "a-key-that-does-not-exist", NewId = "new-id" } };
        await textsService.UpdateRelatedFiles(org, targetRepository, developer, keyMutations);
        AltinnAppGitRepository altinnAppGitRepository = altinnGitRepositoryFactory.GetAltinnAppGitRepository(org, targetRepository, developer);
        JsonNode formLayout = await altinnAppGitRepository.GetLayout(layoutSetName, layoutName);

        formLayout.Should().NotBeNull();
        (formLayout["data"]["layout"] as JsonArray)[0]["textResourceBindings"]["title"].ToString().Should().Be("some-old-id");
    }

    [Fact]
    public async Task UpdateRelatedFiles_WithoutNewKey_ShouldDeleteReference()
    {
        string org = "ttd";
        string repository = "app-with-layoutsets";
        string developer = "testUser";
        string layoutSetName = "layoutSet1";
        string layoutName = "layoutFile1InSet1.json";
        string targetRepository = TestDataHelper.GenerateTestRepoName();

        AltinnGitRepositoryFactory altinnGitRepositoryFactory = new(TestDataHelper.GetTestDataRepositoriesRootDirectory());
        TextsService textsService = GetTextsServiceForTest();
        CreatedTestRepoPath = await TestDataHelper.CopyRepositoryForTest(org, repository, developer, targetRepository);

        List<TextIdMutation> keyMutations = new() { new() { OldId = "some-old-id" } };
        await textsService.UpdateRelatedFiles(org, targetRepository, developer, keyMutations);
        AltinnAppGitRepository altinnAppGitRepository = altinnGitRepositoryFactory.GetAltinnAppGitRepository(org, targetRepository, developer);
        JsonNode formLayout = await altinnAppGitRepository.GetLayout(layoutSetName, layoutName);

        formLayout.Should().NotBeNull();
        formLayout.ToString().Should().NotContain("some-old-key");
    }

    public void Dispose()
    {
        if (!string.IsNullOrEmpty(CreatedTestRepoPath))
        {
            TestDataHelper.DeleteDirectory(CreatedTestRepoPath);
        }
    }

    private static TextsService GetTextsServiceForTest()
    {
        AltinnGitRepositoryFactory altinnGitRepositoryFactory = new(TestDataHelper.GetTestDataRepositoriesRootDirectory());
        GeneralSettings generalSettings = new()
        {
            TemplateLocation = @"../../../../../../testdata/AppTemplates/AspNet",
            DeploymentLocation = @"../../../../../../testdata/AppTemplates/AspNet/deployment",
            AppLocation = @"../../../../../../testdata/AppTemplates/AspNet/App"
        };
        EnvironmentsService environmentsService = new(new HttpClient(), generalSettings, new Mock<IMemoryCache>().Object, new Mock<ILogger<EnvironmentsService>>().Object);
        AltinnStorageAppMetadataClient altinnStorageAppMetadataClient = new(new HttpClient(), environmentsService, new PlatformSettings());
        ApplicationMetadataService applicationMetadataService = new(new Mock<ILogger<ApplicationMetadataService>>().Object, altinnStorageAppMetadataClient, altinnGitRepositoryFactory, new Mock<IHttpContextAccessor>().Object);
        TextsService textsService = new(altinnGitRepositoryFactory, applicationMetadataService);

        return textsService;
    }
}
