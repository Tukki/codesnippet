#_*_ coding: utf-8 _*_

from urlparse import urlparse, urlunparse
from urllib import urlencode
try:
    from urlparse import parse_qs
except ImportError:#pragma: no cover
    from cgi import parse_qs

from webob import Request
# TODO: Stop using Paste; we already started using WebOb
from webob.exc import HTTPFound, HTTPUnauthorized
from paste.request import construct_url, parse_dict_querystring, parse_formvars
from zope.interface import implements

from repoze.who.interfaces import IChallenger, IIdentifier

from repoze.who.plugins.friendlyform import FriendlyFormPlugin as FFB_default

"""Collection of :mod:`repoze.who` friendly forms"""


class FriendlyFormPlugin(FFB_default):

    def __init__(self, login_form_url, login_handler_path, post_login_url,
                 logout_handler_path, post_logout_url, rememberer_name,
                 login_counter_name=None, charset="iso-8859-1", max_age=2592000):
        super(FriendlyFormPlugin, self).__init__(login_form_url, 
                                                 login_handler_path,
                                                 post_login_url,
                                                 logout_handler_path,
                                                 post_logout_url,
                                                 rememberer_name,
                                                 login_counter_name,
                                                 charset)
        self.max_age = max_age

   # IIdentifier
    def identify(self, environ):
        """
        Override the parent's identifier to introduce a login counter
        (possibly along with a post-login page) and load the login counter into
        the ``environ``.

        """
        request = Request(environ, charset=self.charset)

        path_info = environ['PATH_INFO']
        script_name = environ.get('SCRIPT_NAME') or '/'
        query = request.GET

        if path_info == self.login_handler_path:
            ## We are on the URL where repoze.who processes authentication. ##
            # Let's append the login counter to the query string of the
            # "came_from" URL. It will be used by the challenge below if
            # authorization is denied for this request.
            form = dict(request.POST)
            form.update(query)
            try:
                login = form['login']
                password = form['password']
            except KeyError:
                credentials = None
            else:
                if request.charset == "us-ascii":
                    credentials = {
                        'login': str(login),
                        'password': str(password),
                        }
                else:
                    credentials = {'login': login,'password': password}

            #try:
            #    credentials['max_age'] = form['remember']
            #except KeyError:
            #    pass

            # if the form has remember, set the max_age
            if form.get('remember'):
                credentials['max_age'] = self.max_age


            referer = environ.get('HTTP_REFERER', script_name)
            destination = form.get('came_from', referer)

            if self.post_login_url:
                # There's a post-login page, so we have to replace the
                # destination with it.
                destination = self._get_full_path(self.post_login_url,
                                                  environ)
                if 'came_from' in query:
                    # There's a referrer URL defined, so we have to pass it to
                    # the post-login page as a GET variable.
                    destination = self._insert_qs_variable(destination,
                                                           'came_from',
                                                           query['came_from'])
            failed_logins = self._get_logins(environ, True)
            new_dest = self._set_logins_in_url(destination, failed_logins)
            environ['repoze.who.application'] = HTTPFound(location=new_dest)
            return credentials

        elif path_info == self.logout_handler_path:
            ##    We are on the URL where repoze.who logs the user out.    ##
            form = parse_formvars(environ)
            form.update(query)
            referer = environ.get('HTTP_REFERER', script_name)
            came_from = form.get('came_from', referer)
            # set in environ for self.challenge() to find later
            environ['came_from'] = came_from
            environ['repoze.who.application'] = HTTPUnauthorized()
            return None

        elif path_info == self.login_form_url or self._get_logins(environ):
            ##  We are on the URL that displays the from OR any other page  ##
            ##   where the login counter is included in the query string.   ##
            # So let's load the counter into the environ and then hide it from
            # the query string (it will cause problems in frameworks like TG2,
            # where this unexpected variable would be passed to the controller)
            environ['repoze.who.logins'] = self._get_logins(environ, True)
            # Hiding the GET variable in the environ:
            if self.login_counter_name in query:
                del query[self.login_counter_name]
                environ['QUERY_STRING'] = urlencode(query, doseq=True)

