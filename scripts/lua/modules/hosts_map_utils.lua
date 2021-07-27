--
-- (C) 2013-21 - ntop.org
--

local hosts_map_utils = {}

-- Simple Lua "enumerator" to improve code readability
hosts_map_utils.HostsMapMode = {
    ALL_FLOWS = 0,
    UNREACHABLE_FLOWS  = 1,
    ALERTED_FLOWS = 2,
    DNS_QUERIES = 3,
    SYN_DISTRIBUTION = 4,
    SYN_VS_RST = 5,
    SYN_VS_SYNACK = 6,
    TCP_PKTS_SENT_VS_RCVD = 7,
    TCP_BYTES_SENT_VS_RCVD = 8,
    ACTIVE_ALERT_FLOWS = 9,
    TRAFFIC_RATIO = 10,
    SCORE = 11,
    BLACKLISTED_FLOWS_HOSTS = 12,
}

hosts_map_utils.MODES = {
   {
        mode = hosts_map_utils.HostsMapMode.ALL_FLOWS,
        label   = i18n("hosts_map_page.all_flows"),
        x_label = i18n("hosts_map_page.labels.f_s"),
        y_label = i18n("hosts_map_page.labels.f_c"),
        x_formatter = "fint",
        y_formatter = "fint",
    }, {
        mode = hosts_map_utils.HostsMapMode.UNREACHABLE_FLOWS,
        label   = i18n("hosts_map_page.unreach_flows"),
        x_label = i18n("hosts_map_page.labels.uf_s"),
        y_label = i18n("hosts_map_page.labels.uf_c"),
        x_formatter = "fint",
        y_formatter = "fint",
    }, {
        mode = hosts_map_utils.HostsMapMode.ALERTED_FLOWS,
        label   = i18n("hosts_map_page.alerted_flows"),
        x_label = i18n("hosts_map_page.labels.af_s"),
        y_label = i18n("hosts_map_page.labels.af_c"),
        x_formatter = "fint",
        y_formatter = "fint",
    }, {
        mode = hosts_map_utils.HostsMapMode.DNS_QUERIES,
        label   = i18n("hosts_map_page.dns_queries"),
        x_label = i18n("hosts_map_page.labels.dns_p_r"),
        y_label = i18n("hosts_map_page.labels.dns_s"),
        x_formatter = "fint",
        y_formatter = "fint",
    }, {
        mode = hosts_map_utils.HostsMapMode.SYN_DISTRIBUTION,
        label   = i18n("hosts_map_page.syn_distribution"),
        x_label = i18n("hosts_map_page.labels.syn_s"),
        y_label = i18n("hosts_map_page.labels.syn_r"),
        x_formatter = "fint",
        y_formatter = "fint",
    }, {
        mode = hosts_map_utils.HostsMapMode.SYN_VS_RST,
        label   = i18n("hosts_map_page.syn_vs_rst"),
        x_label = i18n("hosts_map_page.labels.syn_s"),
        y_label = i18n("hosts_map_page.labels.rst_r"),
        x_formatter = "fint",
        y_formatter = "fint",
    }, {
        mode = hosts_map_utils.HostsMapMode.SYN_VS_SYNACK,
        label   = i18n("hosts_map_page.syn_vs_synack"),
        x_label = i18n("hosts_map_page.labels.syn_s"),
        y_label = i18n("hosts_map_page.labels.sa_r"),
        x_formatter = "fint",
        y_formatter = "fint",
    }, {
        mode = hosts_map_utils.HostsMapMode.TCP_PKTS_SENT_VS_RCVD,
        label   = i18n("hosts_map_page.tcp_pkts_sent_vs_rcvd"),
        x_label = i18n("hosts_map_page.labels.tcp_p_s"),
        y_label = i18n("hosts_map_page.labels.tcp_p_r"),
        x_formatter = "fint",
        y_formatter = "fint",
    }, {
        mode = hosts_map_utils.HostsMapMode.TCP_BYTES_SENT_VS_RCVD,
        label   = i18n("hosts_map_page.tcp_bytes_sent_vs_rcvd"),
        x_label = i18n("hosts_map_page.labels.tcp_b_s"),
        y_label = i18n("hosts_map_page.labels.tcp_b_r"),
        x_formatter = "bytesToSize",
        y_formatter = "bytesToSize",
       }, {
        mode = hosts_map_utils.HostsMapMode.ACTIVE_ALERT_FLOWS,
        label   = i18n("hosts_map_page.active_alert_flows"),
        x_label = i18n("hosts_map_page.labels.f_a_s"),
        y_label = i18n("hosts_map_page.labels.f_a_c"),
        x_formatter = "fint",
        y_formatter = "fint",
    }, {
        mode = hosts_map_utils.HostsMapMode.TRAFFIC_RATIO,
        label   = i18n("hosts_map_page.traffic_ratio"),
        x_label = i18n("hosts_map_page.labels.b_ratio"),
        y_label = i18n("hosts_map_page.labels.p_ratio"),
        x_formatter = "fint",
        y_formatter = "fint",
    }, {
        mode = hosts_map_utils.HostsMapMode.SCORE,
        label   = i18n("hosts_map_page.score"),
        x_label = i18n("hosts_map_page.labels.client_score"),
        y_label = i18n("hosts_map_page.labels.server_score"),
        x_formatter = "fint",
        y_formatter = "fint",
    }, {
        mode = hosts_map_utils.HostsMapMode.BLACKLISTED_FLOWS_HOSTS,
        label   = i18n("hosts_map_page.blacklisted_flows_hosts"),
        x_label = i18n("hosts_map_page.labels.blacklisted_as_client"),
        y_label = i18n("hosts_map_page.labels.blacklisted_as_server"),
        x_formatter = "fint",
        y_formatter = "fint",
    }
}

return hosts_map_utils
