#! /usr/bin/env bash
# This file tests the netlify function for sending emails

# Check if the port is already used or not
is_using=$(lsof -i:9999 | awk -F '  ' '{ print $1 }')
if [ -z "$is_using" ]; then
	echo "Starting a server on port 9999";
	netlify functions:serve  --port 9999 &
elif ! [[ "$is_using" =~ .*"node".* ]]; then
	echo "$is_using"
	echo "The port 9999 is already used and not by us :-("
	exit 1;
else
	echo "The server is running."
fi


netlify functions:invoke --port 9999 send-emails --payload '{"recipients"
: {"pierrelouisguhur@gmail.com": {"title": "Test", "adminUrl": "foo"}}, "action": "invite", "locale": "gb"}'
