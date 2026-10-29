FROM wodby/vinyl:9.1.0-r9@sha256:ed50db5bf4f4bba4a6e470782e6ccc833fa6c84a6857bb8e1d1d7f434fef7501

USER root

# The Alpine-based Vinyl image already includes curl for the readiness gate.
COPY docker/varnish/start-varnish.sh /usr/local/bin/start-chyp-varnish.sh
RUN chmod +x /usr/local/bin/start-chyp-varnish.sh

USER varnish

# Keep the deployment-mounted VCL; bypass Wodby's template-generating entrypoint.
ENTRYPOINT ["/usr/local/bin/start-chyp-varnish.sh"]
CMD ["-F", "-f", "/etc/varnish/default.vcl", "-a", ":80", "-s", "file,/var/lib/varnish/cache.bin,4G"]
