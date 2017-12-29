using ELM.ELMData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Http.Cors;
using System.Threading.Tasks;
using System.Text;
using System.Web.Script.Serialization;
using System.Web.Configuration;

namespace ELM.Controllers
{
    [System.Web.Http.RoutePrefix("v1")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ELMController : ApiController
    {

        private static HttpClient _client;

        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("login")]
        public HttpResponseMessage Login(string userName, string password,string token)
        {
            try
            {
                using (ELMEntities context = new ELMEntities())
                {
                    ELM.Domain.UsersList user = (from u in context.SystemUsers
                                                 where u.UserName == userName && u.Password == password
                                                 select new ELM.Domain.UsersList
                                                 {
                                                     UserName = u.UserName,
                                                     Id = u.Id,
                                                     Password = u.Password,
                                                     UserRegToken = u.UserRegToken
                                                 }).FirstOrDefault();
                    //bool isAny = false;
                    if (user != null)
                    {
                        return Request.CreateResponse(HttpStatusCode.OK, user);
                        SystemUser sysUser = context.SystemUsers.Where(w => w.UserName == userName && w.Password == password).FirstOrDefault();
                        sysUser.UserRegToken = token;
                        context.SaveChanges();
                    }
                    else
                        return Request.CreateResponse(HttpStatusCode.NotFound, "Login Failed");
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, new
                {
                    message = ex.Message,
                    code = "error"
                });
            }
        }

        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("getPermissionList")]
        public HttpResponseMessage GetPermissionList(string userName)
        {
            try
            {
                using (ELMEntities context = new ELMEntities())
                {
                    List<ELM.Domain.JIRATask> taskInfo = (from info in context.TaskInformations
                                                          join user in context.SystemUsers on info.UserId equals user.Id
                                                          where user.UserName == userName && info.PermissionDate <= DateTime.Now && info.PermissionType != null
                                                          select new ELM.Domain.JIRATask
                                                          {
                                                              Id = info.Id,
                                                              UserId = info.UserId,
                                                              InTime = info.InTime,
                                                              PermissionDate = info.PermissionDate,
                                                              PermissionType = info.PermissionType,
                                                              IsTaskCreated = info.IsTaskCreated,
                                                              TaskID = info.TaskID
                                                          }).OrderByDescending(o => o.PermissionDate).ToList();
                    foreach(var info in taskInfo)
                    {
                        DateTime? date = DateTime.Now + info.InTime;
                        info.InTimeString = date.Value.ToString("hh:mm tt");
                    }
                    return Request.CreateResponse(HttpStatusCode.OK, taskInfo);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, new
                {
                    message = ex.Message,
                    code = "error"
                });
            }
        }

        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("createJIRATask")]
        public async Task<HttpResponseMessage> createJIRATask(string permissionType, int userId, DateTime inTime)
        {
            try
            {
                ELM.Domain.ELM task = new ELM.Domain.ELM()
                {
                    issueType = "Story",
                    project = "TP",
                    reporter = "abbask",
                    description = "Test content from Leave System",
                    summary = "Test content from Leave System - "+ permissionType,
                    components = new List<string>(new string[] { "Others" }),
                    priority = "Low"
                };

                ELM.Domain.JIRACreateTaskResult _projectTrackerResult = new ELM.Domain.JIRACreateTaskResult();
                ELM.Domain.JIRAFields _jiraObjects;
                ELM.Domain.Fields fields;
                int _timeCount = 0;
                while (_timeCount < 3)
                {
                    try
                    {
                        fields = new ELM.Domain.Fields();
                        _jiraObjects = new ELM.Domain.JIRAFields();
                        fields.project.key = (!string.IsNullOrEmpty(task.project)) ? task.project.Trim() : string.Empty;
                        fields.issuetype.name = (!string.IsNullOrEmpty(task.issueType)) ? task.issueType.Trim() : string.Empty;
                        fields.summary = (!string.IsNullOrEmpty(task.summary)) ? task.summary.Trim() : string.Empty;
                        fields.description = (!string.IsNullOrEmpty(task.description)) ? task.description.Trim() : string.Empty;
                        //fields.duedate = (pInputValues.duedate.HasValue) ? pInputValues.duedate.Value.ToString("yyyy-MM-dd") : string.Empty;
                        fields.priority.name = (!string.IsNullOrEmpty(task.priority)) ? task.priority.Trim() : string.Empty;
                        //fields.assignee.name = (!string.IsNullOrEmpty(pInputValues.assignee)) ? pInputValues.assignee.Trim() : string.Empty;
                        fields.reporter.name = (!string.IsNullOrEmpty(task.reporter)) ? task.reporter.Trim() : string.Empty;

                        if (task.components != null && task.components.Count > 0)
                        {
                            foreach (var component in task.components)
                            {
                                fields.components.Add(new ELM.Domain.JiraNameFields { name = component.ToString().Trim() });
                            }
                        }

                        _jiraObjects.fields = fields;

                        string jiraUserName = WebConfigurationManager.AppSettings["JIRAUserName"];
                        string jiraPassword = WebConfigurationManager.AppSettings["JIRAUserPassword"];
                        string CredentialString = jiraUserName + ":" + jiraPassword;
                        _client = new HttpClient();
                        _client.DefaultRequestHeaders.ExpectContinue = false;
                        _client.Timeout = TimeSpan.FromMinutes(90);
                        byte[] Crdential = UTF8Encoding.UTF8.GetBytes(CredentialString);
                        _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(Crdential));
                        _client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

                        JavaScriptSerializer serializer = new JavaScriptSerializer();
                        string json = serializer.Serialize((Object)_jiraObjects);

                        System.Net.Http.HttpContent content = new StringContent(json, UTF8Encoding.UTF8, "application/json");

                        HttpResponseMessage response = await _client.PostAsync("https://syncfusion.atlassian.net/rest/api/2/issue", content).ConfigureAwait(false);
                        response.EnsureSuccessStatusCode();

                        if (response.StatusCode == System.Net.HttpStatusCode.Created)
                        {
                            string responseMessage = response.Content.ReadAsStringAsync().Result;
                            var serialize = new JavaScriptSerializer();
                            var message = serialize.Deserialize<dynamic>(responseMessage);
                            _timeCount = 3;
                            _projectTrackerResult.ErrorMessage = message["key"];
                            _projectTrackerResult.IsTaskCreated = true;
                        }
                        else
                        {
                            _projectTrackerResult.IsTaskCreated = false;
                            _projectTrackerResult.ErrorMessage = "Unable to create the requested task. Please try again.";
                        }
                    }
                    catch (Exception ex)
                    {
                        _timeCount++;
                        _projectTrackerResult.IsTaskCreated = false;
                        _projectTrackerResult.ErrorMessage = ex.Message + Environment.NewLine + ex.InnerException + Environment.NewLine + ex.StackTrace;
                    }
                }

                #region Create Task in Local DB
                using(ELMEntities context = new ELMEntities())
                {
                    TaskInformation info = new TaskInformation()
                    {
                        UserId = userId,
                        InTime = inTime.TimeOfDay,
                        PermissionDate = DateTime.Now,
                        PermissionType = permissionType,
                        IsTaskCreated = true,
                        TaskID = _projectTrackerResult.ErrorMessage
                    };
                    context.TaskInformations.Add(info);
                    context.SaveChanges();
                }
                #endregion

                return Request.CreateResponse(HttpStatusCode.OK, _projectTrackerResult);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, new
                {
                    message = ex.Message,
                    code = "error"
                });
            }
        }

        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("getAllUsers")]
        public HttpResponseMessage GetAllUsers()
        {
            try
            {
                List<ELM.Domain.UsersList> usersList = new List<ELM.Domain.UsersList>();
                using (ELMEntities context = new ELMEntities())
                {
                    usersList = (from u in context.SystemUsers
                                 select new ELM.Domain.UsersList
                                 {
                                     Id = u.Id,
                                     UserName = u.UserName,
                                     Password = u.Password,
                                     UserRegToken = u.UserRegToken
                                 }).ToList();
                }
                return Request.CreateResponse(HttpStatusCode.OK, usersList);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, new
                {
                    message = ex.Message,
                    code = "error"
                });
            }
        }

    }
}