FROM webdevops/php-nginx-dev:7.4

# Environment settings
ENV COMPOSER_ALLOW_SUPERUSER=1 \
    VERSION_PRESTISSIMO_PLUGIN=^0.3.7

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- \
        --filename=composer.phar \
        --install-dir=/usr/local/bin && \
    composer clear-cache

# Install composer plugins
RUN composer global require --optimize-autoloader \
        "hirak/prestissimo:${VERSION_PRESTISSIMO_PLUGIN}" && \
    composer global dumpautoload --optimize && \
    composer clear-cache

# Install Yii framework bash autocompletion
RUN curl -L https://raw.githubusercontent.com/yiisoft/yii2/master/contrib/completion/bash/yii \
        -o /etc/bash_completion.d/yii

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

# Install postgres client
RUN apt-get update && apt-get install -y postgresql-client iproute2 iputils-ping --no-install-recommends && apt-get clean

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

# Application environment
WORKDIR /app/

CMD ["app"]
