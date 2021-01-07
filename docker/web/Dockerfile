ARG BASE_IMAGE=php-nginx
FROM webdevops/${BASE_IMAGE}:7.4 AS dev

# Environment settings
ENV COMPOSER_ALLOW_SUPERUSER=1

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- \
        --filename=composer.phar \
        --install-dir=/usr/local/bin && \
    composer clear-cache

# Install Yii framework bash autocompletion
#RUN curl -L https://raw.githubusercontent.com/yiisoft/yii2/master/contrib/completion/bash/yii \
#        -o /etc/bash_completion.d/yii

# Install mecab
ENV mecab_url https://drive.google.com/uc?export=download&id=0B4y35FiV1wh7cENtOXlicTFaRUE
RUN set -x \
    && CPUCOUNT=$(getconf _NPROCESSORS_ONLN) \
    # Install MeCab
    && wget -q -O - ${mecab_url} \
        | tar -xzf - -C /tmp \
    && cd /tmp/mecab-[0-9]* \
    && ./configure --enable-utf8-only --with-charset=utf8 --prefix=/usr \
    && make  -j ${CPUCOUNT} \
    && make install \
    && rm -R /tmp/mecab-[0-9]*

# Install mecab-ipadic
ENV mecab_ipa_url https://drive.google.com/uc?export=download&id=0B4y35FiV1wh7MWVlSDBCSXZMTXM
RUN set -x \
    && CPUCOUNT=$(getconf _NPROCESSORS_ONLN) \
    && wget -q -O - ${mecab_ipa_url} \
        | tar -xzf - -C /tmp \
    && cd /tmp/mecab-ipadic-[0-9]* \
    && ./configure --enable-utf8-only --with-charset=utf8 --prefix=/usr \
    && make  -j ${CPUCOUNT} \
    && make install \
    && rm -R /tmp/mecab-ipadic-[0-9]*

# Install postgres client, iputils, screen
RUN (apt-get update || true) && apt-get install -y postgresql-client iproute2 iputils-ping screen --no-install-recommends && apt-get clean

# Install node (see https://github.com/nodejs/docker-node/blob/master/12/buster/Dockerfile)
ENV NODE_VERSION 12.19.0
RUN ARCH=x64 \
  && set -ex \
  && curl -fsSLO --compressed "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-$ARCH.tar.xz" \
  && tar -xJf "node-v$NODE_VERSION-linux-$ARCH.tar.xz" -C /usr/local --strip-components=1 --no-same-owner \
  && rm "node-v$NODE_VERSION-linux-$ARCH.tar.xz" \
  && ln -s /usr/local/bin/node /usr/local/bin/nodejs

ENV YARN_VERSION 1.22.5
RUN set -ex \
  && curl -fsSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" \
  && mkdir -p /opt \
  && tar -xzf yarn-v$YARN_VERSION.tar.gz -C /opt/ \
  && ln -s /opt/yarn-v$YARN_VERSION/bin/yarn /usr/local/bin/yarn \
  && ln -s /opt/yarn-v$YARN_VERSION/bin/yarnpkg /usr/local/bin/yarnpkg \
  && rm yarn-v$YARN_VERSION.tar.gz

RUN set -ex \
    && curl -fsSLO --compressed "https://github.com/ku-nlp/jumanpp/releases/download/v2.0.0-rc3/jumanpp-2.0.0-rc3.tar.xz" \
    && mkdir -p /var/lib/jumanpp \
    && tar xf jumanpp-2.0.0-rc3.tar.xz --strip-components=2 -C /var/lib/jumanpp jumanpp-2.0.0-rc3/model/jumandic.jppmdl \
    && rm jumanpp-2.0.0-rc3.tar.xz

# Application environment
WORKDIR /app/


FROM dev as prod

#FROM dev as prod-backend
COPY ./backend/composer.json ./backend/composer.lock /app/backend/
RUN cd /app/backend/ && composer install --prefer-dist --no-scripts --no-dev --no-autoloader && rm -rf /root/.composer
COPY ./backend /app/backend
RUN cd /app/backend/ && composer dump-autoload --no-scripts --no-dev --optimize

#FROM dev as prod-backend-ts
COPY ./backend-ts/package.json ./backend-ts/package-lock.json /app/backend-ts/
RUN cd /app/backend-ts/ && npm ci
COPY ./backend-ts/ /app/backend-ts/
RUN cd /app/backend-ts/ && npm run build

#FROM dev as prod-frontend
COPY ./frontend/package.json ./frontend/package-lock.json /app/frontend/
RUN cd /app/frontend/ && npm ci
COPY ./frontend/ /app/frontend/
RUN cd /app/frontend/ && npm run build # TODO: build-prod

#FROM dev as prod
COPY ./docker/web/nginx/vhost.conf /opt/docker/etc/nginx/vhost.conf
COPY ./docker/web/nginx/vhost-prod.conf /opt/docker/etc/nginx/vhost-prod.conf
COPY ./docker/web/php/php.ini /opt/docker/etc/php/php.ini
COPY ./docker/web/supervisord/postfix.conf /opt/docker/etc/supervisor.d/postfix.conf
COPY ./docker/web/supervisord/juman.conf /opt/docker/etc/supervisor.d/juman.conf
COPY ./docker/web/supervisord/backendts.conf /opt/docker/etc/supervisor.d/backendts.conf
COPY ./docker/web/entrypoint.sh /opt/docker/bin/entrypoint.d/app.sh
COPY ./docker /app/docker
COPY ./run /app/run
#COPY --from=prod-backend /app/backend /app/backend
#COPY --from=prod-backend-ts /app/backend-ts /app/backend-ts
#COPY --from=prod-frontend /app/frontend /app/frontend