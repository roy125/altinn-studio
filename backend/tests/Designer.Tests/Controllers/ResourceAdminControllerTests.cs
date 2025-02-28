﻿using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Altinn.Studio.Designer.Configuration;
using Altinn.Studio.Designer.Controllers;
using Altinn.Studio.Designer.Enums;
using Altinn.Studio.Designer.Models;
using Altinn.Studio.Designer.Services.Interfaces;
using Designer.Tests.Controllers.ApiTests;
using Designer.Tests.Mocks;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Xunit;

namespace Designer.Tests.Controllers
{
    public class ResourceAdminControllerTests : ApiTestsBase<ResourceAdminController, ResourceAdminControllerTests>
    {
        private readonly string _versionPrefix = "/designer/api";
        private readonly Mock<IRepository> _repositoryMock;

        public ResourceAdminControllerTests(WebApplicationFactory<ResourceAdminController> factory) : base(factory)
        {
            _repositoryMock = new Mock<IRepository>();
        }

        protected override void ConfigureTestServices(IServiceCollection services)
        {
            services.Configure<ServiceRepositorySettings>(c =>
                c.RepositoryLocation = TestRepositoriesLocation);
            services.AddSingleton<IGitea, IGiteaMock>();
            services.AddTransient(_ => _repositoryMock.Object);
        }

        [Fact]
        public async Task GetResourceRepository_OK()
        {
            // Arrange
            string uri = $"{_versionPrefix}/ttd/resources/repository";

            HttpRequestMessage httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, uri);

            // Act
            HttpResponseMessage res = await HttpClient.Value.SendAsync(httpRequestMessage).ConfigureAwait(false);

            // Assert
            Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        }

        [Fact]
        public async Task GetResourceRepository_NoContent()
        {
            // Arrange
            string uri = $"{_versionPrefix}/orgwithoutrepo/resources/repository";

            HttpRequestMessage httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, uri);

            // Act
            HttpResponseMessage res = await HttpClient.Value.SendAsync(httpRequestMessage).ConfigureAwait(false);

            // Assert
            Assert.Equal(HttpStatusCode.NoContent, res.StatusCode);
        }

        [Fact]
        public async Task GetResourceList_OK()
        {
            // Arrange
            string uri = $"{_versionPrefix}/ttd/resources/repository/resourcelist";

            _repositoryMock
                .Setup(r => r.GetServiceResources(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns(new List<ServiceResource>
                {
                    new ServiceResource
                    {
                        Identifier = "testresource",
                        Title = new Dictionary<string, string>(),
                        Description = new Dictionary<string, string>(),
                        RightDescription = new Dictionary<string, string>(),
                        Homepage = "test.no",
                        Status = string.Empty,
                        ValidFrom = new System.DateTime(),
                        ValidTo = new System.DateTime(),
                        IsPartOf = string.Empty,
                        IsPublicService = true,
                        ThematicArea = string.Empty,
                        ResourceReferences = GetTestResourceReferences(),
                        IsComplete = true,
                        Delegable = true,
                        Visible = true,
                        HasCompetentAuthority = new CompetentAuthority { Organization = "ttd", Orgcode = "test", Name = new Dictionary<string, string>() },
                        Keywords = GetTestKeywords(),
                        Sector = new List<string>(),
                        ResourceType = ResourceType.Default,
                        MainLanguage = "en-US",
                    }
                });

            HttpRequestMessage httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, uri);

            // Act
            HttpResponseMessage res = await HttpClient.Value.SendAsync(httpRequestMessage).ConfigureAwait(false);

            // Assert
            Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        }

        [Fact]
        public async Task GetResourceList_NoContent()
        {
            // Arrange
            string uri = $"{_versionPrefix}/orgwithoutrepo/resources/repository/resourcelist";

            HttpRequestMessage httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, uri);

            // Act
            HttpResponseMessage res = await HttpClient.Value.SendAsync(httpRequestMessage).ConfigureAwait(false);

            // Assert
            Assert.Equal(HttpStatusCode.NoContent, res.StatusCode);
        }

        private static List<Keyword> GetTestKeywords()
        {
            List<Keyword> keywords = new List<Keyword>();
            Keyword keyword = new Keyword { Language = "No", Word = "test" };
            keywords.Add(keyword);
            return keywords;
        }

        [Fact]
        public async Task GetResourceById_OK()
        {
            // Arrange
            string uri = $"{_versionPrefix}/ttd/resources/repository/ttd-resources/ttd_testresource";

            _repositoryMock
                .Setup(r => r.GetServiceResourceById(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns(
                    new ServiceResource
                    {
                        Identifier = "testresource",
                        Title = new Dictionary<string, string>(),
                        Description = new Dictionary<string, string>(),
                        RightDescription = new Dictionary<string, string>(),
                        Homepage = "test.no",
                        Status = string.Empty,
                        ValidFrom = new System.DateTime(),
                        ValidTo = new System.DateTime(),
                        IsPartOf = string.Empty,
                        IsPublicService = true,
                        ThematicArea = string.Empty,
                        ResourceReferences = GetTestResourceReferences(),
                        IsComplete = true,
                        Delegable = true,
                        Visible = true,
                        HasCompetentAuthority = new CompetentAuthority { Organization = "ttd", Orgcode = "test", Name = new Dictionary<string, string>() },
                        Keywords = GetTestKeywords(),
                        Sector = new List<string>(),
                        ResourceType = ResourceType.Default,
                        MainLanguage = "en-US",
                    });

            HttpRequestMessage httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, uri);

            // Act
            HttpResponseMessage res = await HttpClient.Value.SendAsync(httpRequestMessage).ConfigureAwait(false);

            // Assert
            Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        }

        [Fact]
        public async Task GetResourceById_Passing_Repository_OK()
        {
            // Arrange
            string uri = $"{_versionPrefix}/ttd/resources/repository/repository:ttd-app-resources";

            _repositoryMock
                .Setup(r => r.GetServiceResources(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns(new List<ServiceResource>
                {
                    new ServiceResource
                    {
                        Identifier = "testresource",
                        Title = new Dictionary<string, string>(),
                        Description = new Dictionary<string, string>(),
                        RightDescription = new Dictionary<string, string>(),
                        Homepage = "test.no",
                        Status = string.Empty,
                        ValidFrom = new System.DateTime(),
                        ValidTo = new System.DateTime(),
                        IsPartOf = string.Empty,
                        IsPublicService = true,
                        ThematicArea = string.Empty,
                        ResourceReferences = GetTestResourceReferences(),
                        IsComplete = true,
                        Delegable = true,
                        Visible = true,
                        HasCompetentAuthority = new CompetentAuthority { Organization = "ttd", Orgcode = "test", Name = new Dictionary<string, string>() },
                        Keywords = GetTestKeywords(),
                        Sector = new List<string>(),
                        ResourceType = ResourceType.Default,
                        MainLanguage = "en-US",
                    }
                });

            HttpRequestMessage httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, uri);

            // Act
            HttpResponseMessage res = await HttpClient.Value.SendAsync(httpRequestMessage).ConfigureAwait(false);

            // Assert
            Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        }

        [Fact]
        public async Task GetResourceById_NoContent()
        {
            // Arrange
            string uri = $"{_versionPrefix}/orgwithoutrepo/resources/repository/id:ttd_test_resource";

            HttpRequestMessage httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, uri);

            // Act
            HttpResponseMessage res = await HttpClient.Value.SendAsync(httpRequestMessage).ConfigureAwait(false);

            // Assert
            Assert.Equal(HttpStatusCode.NoContent, res.StatusCode);
        }

        [Fact]
        public async Task GetResourceById_Passing_Repository_NoContent()
        {
            // Arrange
            string uri = $"{_versionPrefix}/orgwithoutrepo/resources/repository/repository:ttd-resources";

            HttpRequestMessage httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, uri);

            // Act
            HttpResponseMessage res = await HttpClient.Value.SendAsync(httpRequestMessage).ConfigureAwait(false);

            // Assert
            Assert.Equal(HttpStatusCode.NoContent, res.StatusCode);
        }

        [Fact]
        public async Task GetResourceById_PassingNoValidArgument_NoContent()
        {
            // Arrange
            string uri = $"{_versionPrefix}/orgwithoutrepo/resources/repository/orgwithoutrepo-resources/notvalidresource";

            HttpRequestMessage httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, uri);

            // Act
            HttpResponseMessage res = await HttpClient.Value.SendAsync(httpRequestMessage).ConfigureAwait(false);

            // Assert
            Assert.Equal(HttpStatusCode.NoContent, res.StatusCode);
        }

        private static List<ResourceReference> GetTestResourceReferences()
        {
            List<ResourceReference> resourceReferences = new List<ResourceReference>
            {
                new ResourceReference { Reference = string.Empty, ReferenceSource = ReferenceSource.Default, ReferenceType = ReferenceType.Default }
            };

            return resourceReferences;
        }
    }
}
