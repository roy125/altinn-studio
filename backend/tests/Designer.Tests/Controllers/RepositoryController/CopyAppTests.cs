﻿using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Altinn.Studio.Designer.RepositoryClient.Model;
using Microsoft.AspNetCore.Mvc.Testing;
using Moq;
using Xunit;

namespace Designer.Tests.Controllers.RepositoryController
{
    public class CopyAppTests : RepositoryControllerTestsBase<CopyAppTests>
    {
        public CopyAppTests(WebApplicationFactory<Altinn.Studio.Designer.Controllers.RepositoryController> factory) : base(factory)
        {
        }

        [Fact]
        public async Task CopyApp_RepoHasCreatedStatus_DeleteRepositoryIsNotCalled()
        {
            // Arrange
            string uri = $"{VersionPrefix}/repo/ttd/copy-app?sourceRepository=apps-test&targetRepository=cloned-app";

            RepositoryMock
                .Setup(r => r.CopyRepository(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(new Repository { RepositoryCreatedStatus = HttpStatusCode.Created, CloneUrl = "https://www.vg.no" });

            using HttpRequestMessage httpRequestMessage = new HttpRequestMessage(HttpMethod.Post, uri);

            // Act
            using HttpResponseMessage res = await HttpClient.Value.SendAsync(httpRequestMessage);

            // Assert
            RepositoryMock.VerifyAll();
            Assert.Equal(HttpStatusCode.Created, res.StatusCode);
        }

        [Fact]
        public async Task CopyApp_TargetRepoAlreadyExists_ConflictIsReturned()
        {
            // Arrange
            string uri = $"{VersionPrefix}/repo/ttd/copy-app?sourceRepository=apps-test&targetRepository=existing-repo";

            using HttpRequestMessage httpRequestMessage = new HttpRequestMessage(HttpMethod.Post, uri);

            // Act
            using HttpResponseMessage res = await HttpClient.Value.SendAsync(httpRequestMessage);

            // Assert
            Assert.Equal(HttpStatusCode.Conflict, res.StatusCode);
        }

        [Fact]
        public async Task CopyApp_GiteaTimeout_DeleteRepositoryIsCalled()
        {
            // Arrange
            string uri = $"{VersionPrefix}/repo/ttd/copy-app?sourceRepository=apps-test&targetRepository=cloned-app";

            RepositoryMock
                .Setup(r => r.CopyRepository(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(new Repository { RepositoryCreatedStatus = HttpStatusCode.GatewayTimeout });

            RepositoryMock
                 .Setup(r => r.DeleteRepository(It.IsAny<string>(), It.IsAny<string>()));

            HttpRequestMessage httpRequestMessage = new HttpRequestMessage(HttpMethod.Post, uri);

            // Act
            HttpResponseMessage res = await HttpClient.Value.SendAsync(httpRequestMessage);

            // Assert
            RepositoryMock.VerifyAll();
            Assert.Equal(HttpStatusCode.GatewayTimeout, res.StatusCode);
        }

        [Fact]
        public async Task CopyApp_ExceptionIsThrownByService_InternalServerError()
        {
            // Arrange
            string uri = $"{VersionPrefix}/repo/ttd/copy-app?sourceRepository=apps-test&targetRepository=cloned-app";

            RepositoryMock
                .Setup(r => r.CopyRepository(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
               .Throws(new IOException());

            RepositoryMock
                 .Setup(r => r.DeleteRepository(It.IsAny<string>(), It.IsAny<string>()));

            using HttpRequestMessage httpRequestMessage = new HttpRequestMessage(HttpMethod.Post, uri);

            // Act
            using HttpResponseMessage res = await HttpClient.Value.SendAsync(httpRequestMessage);

            // Assert
            RepositoryMock.VerifyAll();
            Assert.Equal(HttpStatusCode.InternalServerError, res.StatusCode);
        }

        [Fact]
        public async Task CopyApp_InvalidTargetRepoName_BadRequest()
        {
            // Arrange
            string uri = $"{VersionPrefix}/repo/ttd/copy-app?sourceRepository=apps-test&targetRepository=2022-cloned-app";

            using HttpRequestMessage httpRequestMessage = new HttpRequestMessage(HttpMethod.Post, uri);

            // Act
            using HttpResponseMessage res = await HttpClient.Value.SendAsync(httpRequestMessage);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
        }

        [Fact]
        public async Task CopyApp_InvalidSourceRepoName_BadRequest()
        {
            // Arrange
            string uri = $"{VersionPrefix}/repo/ttd/copy-app?sourceRepository=ddd.git%3Furl%3D{{herkanmannåfrittgjøreting}}&targetRepository=cloned-target-app";

            using HttpRequestMessage httpRequestMessage = new HttpRequestMessage(HttpMethod.Post, uri);

            // Act
            using HttpResponseMessage res = await HttpClient.Value.SendAsync(httpRequestMessage);
            string actual = await res.Content.ReadAsStringAsync();

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
            Assert.Contains("is an invalid repository name", actual);
        }

    }
}
