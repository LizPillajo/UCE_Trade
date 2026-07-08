#!/bin/bash
cd /tmp
aws s3 cp s3://uce-trade-frontend-qa/ms9.tar.gz /tmp/ms9.tar.gz
mkdir -p /tmp/ms9-build
cd /tmp/ms9-build
tar -xzf /tmp/ms9.tar.gz
docker build -t lizdaisy/ms9-analytics-dashboards:qa .
MS9_CONTAINER=$(docker ps -a -q -f ancestor=lizdaisy/ms9-analytics-dashboards:qa)
docker inspect --format='{{range .Config.Env}}{{println .}}{{end}}' $MS9_CONTAINER > /tmp/ms9_env.list
docker rm -f $MS9_CONTAINER
docker run -d --restart always -p 3009:3009 --env-file /tmp/ms9_env.list lizdaisy/ms9-analytics-dashboards:qa
