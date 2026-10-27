FROM wodby/vinyl:9.1.0-r8@sha256:37bc64bbb92175b9fa6dfabec6ab1872262b778d200eeea17f586adf8987a8c8

USER root

# The Alpine-based Vinyl image already includes curl for the readiness gate.
COPY docker/varnish/start-varnish.sh /usr/local/bin/start-chyp-varnish.sh
RUN chmod +x /usr/local/bin/start-chyp-varnish.sh

USER varnish

# Keep the deployment-mounted VCL; bypass Wodby's template-generating entrypoint.
ENTRYPOINT ["/usr/local/bin/start-chyp-varnish.sh"]
CMD ["-F", "-f", "/etc/varnish/default.vcl", "-a", ":80", "-s", "file,/var/lib/varnish/cache.bin,4G"]
