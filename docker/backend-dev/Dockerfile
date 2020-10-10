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

RUN apt-get update && apt-get install -y postgresql-client iproute2 iputils-ping --no-install-recommends && apt-get clean

# Application environment
WORKDIR /app/backend

CMD ["app"]
