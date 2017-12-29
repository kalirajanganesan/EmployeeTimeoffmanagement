using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ELM.Domain
{
    public class ELM
    {
        public string project { get; set; }                                 //Project
        public string issueType { get; set; }                               //Issue Type
        public string summary { get; set; }                                 //Summary 
        public string description { get; set; }                             //Description 
        public DateTime? duedate { get; set; }                              //Due Date
        public List<string> components = new List<string>();                //Components 
        public string priority { get; set; }                                //Priority 
        public string assignee { get; set; }                                //Assignee
        public string reporter { get; set; }                                //Reporter 
        public List<string> additionalNotification = new List<string>();    //Additional Notification     
    }

    public class JIRACreateTaskResult
    {
        public bool IsTaskCreated = false;
        public string ErrorMessage = string.Empty;
    }

    public class JIRAFields
    {
        public Fields fields = new Fields();
        public string jiraIssueKey;
        public JIRAIssueFields jiraIssuefields;
    }

    public class Fields
    {
        public Project project = new Project();                                         //Project Name
        public JiraNameFields issuetype = new JiraNameFields();                         //Issue Type
        public string summary { get; set; }                                             //Summary 
        public string description { get; set; }                                         //Description 
        public string duedate { get; set; }                                             //Due Date
        public List<JiraNameFields> components = new List<JiraNameFields>();            //Components 
        public JiraNameFields priority = new JiraNameFields();                          //Priority 
        public JiraNameFields assignee = new JiraNameFields();                          //Assignee
        public JiraNameFields reporter = new JiraNameFields();                          //Reporter 
        public List<JiraNameFields> customfield_10025 = new List<JiraNameFields>();     //Additional Notification        
    }
    public class Project
    {
        public string key { get; set; }
    }

    public class JiraNameFields
    {
        public string name;
    }

    public class JiraStatus
    {
        public string id;
    }

    public class JIRAIssueUser
    {
        public string name;
        public string displayName;
        public string emailAddress;
    }

    public class JIRAComponents
    {
        public string name;
    }


    public class JIRACreateTaskObjects
    {
        public string project { get; set; }                                 //Project
        public string issueType { get; set; }                               //Issue Type
        public string summary { get; set; }                                 //Summary 
        public string description { get; set; }                             //Description 
        public DateTime? duedate { get; set; }                              //Due Date
        public List<string> components = new List<string>();                //Components 
        public string priority { get; set; }                                //Priority 
        public string assignee { get; set; }                                //Assignee
        public string reporter { get; set; }                                //Reporter 
        public List<string> additionalNotification = new List<string>();    //Additional Notification        
    }

    public class JIRAIssueFields
    {
        public string summary;
        public JIRAIssueStatus status;
        public string customfield_10044; // DirectTrac icident JIRA custom field id
        public JIRAIssueType issuetype;
        public List<JIRAIssueComponents> components;
        public string created;
        public string updated;
        public JIRAIssueProjectRelease customfield_10024;
        public JIRAIssueUser assignee;
        public string duedate;
        public JIRAIssueResolution resolution;
        public string description;
        public JIRAIssueUser reporter;
        public List<JIRAIssueUser> customfield_10025; // Addition Notification users
    }

    public class JIRAIssueStatus
    {
        public string name;
    }
    public class JIRAIssueResolution
    {
        public string name;
    }
    public class JIRAIssueType
    {
        public string name;
    }

    public class JIRAIssueComponents
    {
        public string name;
    }
    public class JIRAIssueProjectRelease
    {
        public string value;
    }

    public class UsersList
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string UserRegToken { get; set; }
    }

    public class JIRATask
    {
        public int Id { get; set; }
        public Nullable<int> UserId { get; set; }
        public Nullable<System.TimeSpan> InTime { get; set; }
        public string InTimeString { get; set; }
        public Nullable<System.DateTime> PermissionDate { get; set; }
        public string PermissionType { get; set; }
        public Nullable<bool> IsTaskCreated { get; set; }

        public string TaskID { get; set; }
    }
}