---
layout: post
title: Adding MVC2 to WebForms in .NET 3.5
---

I've been dealing with a lot of ASP.NET WebForms applications lately and I needed a way facilitate migration to MVC. This is a recount of how I added MVC2 to an existing WebForms ASP.NET app on .NET 3.5, allowing for partial migration as time allows.

The majority of the changes are done in the `web.config`.

Under `<system.web>/<compilation>/<assemblies>` add: 

    <add assembly="System.Core, Version=3.5.0.0, Culture=neutral, PublicKeyToken=B77A5C561934E089"/>
    <add assembly="System.Web.Extensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31BF3856AD364E35"/>
    <add assembly="System.Web.Abstractions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31BF3856AD364E35"/>
    <add assembly="System.Web.Routing, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31BF3856AD364E35"/>
    <add assembly="System.Web.Mvc, Version=2.0.0.0, Culture=neutral, PublicKeyToken=31BF3856AD364E35"/>
    <add assembly="System.Data.Linq, Version=3.5.0.0, Culture=neutral, PublicKeyToken=B77A5C561934E089" />
    <add assembly="System.Data.DataSetExtensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=B77A5C561934E089"/>
    <add assembly="System.Xml.Linq, Version=3.5.0.0, Culture=neutral, PublicKeyToken=B77A5C561934E089"/>

Obviously add the corresponding DLL references to the project.

Under `<system.web>/<httpModules>` add: 

    <add name="UrlRoutingModule" type="System.Web.Routing.UrlRoutingModule, System.Web.Routing, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31BF3856AD364E35" />

Under `<system.web>/<modules>` add:

    <modules runAllManagedModulesForAllRequests="true">
        <remove name="ScriptModule" />
        <remove name="UrlRoutingModule" />
        <add name="ScriptModule" preCondition="managedHandler" type="System.Web.Handlers.ScriptModule, System.Web.Extensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31BF3856AD364E35"/>
        <add name="UrlRoutingModule" type="System.Web.Routing.UrlRoutingModule, System.Web.Routing, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31BF3856AD364E35" />
    </modules>

Under `<system.web>/<pages>/<namespaces>` add:

    <add namespace="System.Web.Mvc"/>
    <add namespace="System.Web.Mvc.Ajax"/>
    <add namespace="System.Web.Mvc.Html"/>
    <add namespace="System.Web.Routing"/>

Create a `Global.asax` file if you don't have one already. Add the following to `Application_Start` method in the code behind file.

        public static void RegisterRoutes(RouteCollection routes) {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            // Ignore aspx pages (web forms take care of these)
            routes.IgnoreRoute("{resource}.aspx/{*pathInfo}");

            routes.MapRoute(
                // Route name
                "Default",
                // URL with parameters
                "{controller}/{action}/{id}",
                // Parameter defaults
                new { controller = "Home", action = "Index", id = "" }
            );
        }

        protected void Application_Start(object sender, EventArgs e) {
            RegisterRoutes(RouteTable.Routes);
        }

Create the following folders in the project:

    Controllers/
    Views/
    Views/Shared/
    Views/Home/

Add a `web.config` file to the `Views/` folder with the following inside https://gist.github.com/1215688

Lastly, close the project and open the `csproj` project file in a text editor and edit the key `<ProjectTypeGuids>`:

    <ProjectTypeGuids>{F85E285D-A4E0-4152-9332-AB1D724D3325};{349c5851-65df-11da-9384-00065b846f21};{fae04ec0-301f-11d3-bf4b-00c04f79efbc}</ProjectTypeGuids>

This will make Visual Studio detect the project as an MVC application, adding the `Add View`, `Add Controller` etc to the context menus of the Solution Explorer.

The following links helped me put this together:

1. http://www.britishdeveloper.co.uk/2010/05/add-mvc2-project-webforms-application.html
2. http://www.hanselman.com/blog/PlugInHybridsASPNETWebFormsAndASPMVCAndASPNETDynamicDataSideBySide.aspx
3. http://stackoverflow.com/questions/571315/how-would-you-sprinkle-in-asp-net-mvc-into-an-existing-web-site-project
4. http://stackoverflow.com/questions/1904524/asp-net-mvc-and-webforms-co-existing
