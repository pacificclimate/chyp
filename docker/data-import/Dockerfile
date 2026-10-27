FROM ghcr.io/osgeo/gdal:alpine-small-3.13.3

# PostGIS runs on the database server; the importer only needs its client tools.
RUN apk upgrade --no-cache \
    && apk add --no-cache postgresql-client

# Copy cleanup and import script
COPY docker/data-import/import_data.sh /usr/local/bin/import_data.sh
RUN chmod +x /usr/local/bin/import_data.sh

# Entrypoint script
ENTRYPOINT ["/usr/local/bin/import_data.sh"]
