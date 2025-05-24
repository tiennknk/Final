import React, { Component } from "react";
import { connect } from 'react-redux';
import { IntlProvider } from "react-intl";

import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/locale-data/en';
import '@formatjs/intl-pluralrules/locale-data/vi';

import '@formatjs/intl-relativetimeformat/polyfill';
import '@formatjs/intl-relativetimeformat/locale-data/en';
import '@formatjs/intl-relativetimeformat/locale-data/vi';

import { LanguageUtils } from '../utils';

// Lấy messages dạng phẳng (flattened) cho từng ngôn ngữ
const messages = LanguageUtils.getFlattenedMessages();

class IntlProviderWrapper extends Component {
    render() {
        const { children, language } = this.props;
        // Fallback về "vi" nếu language chưa được thiết lập
        const locale = language || "vi";
        return (
            <IntlProvider
                locale={locale}
                messages={messages[locale]}
                defaultLocale="vi"
            >
                {children}
            </IntlProvider>
        );
    }
}

// Giả sử bạn lưu ngôn ngữ ở state.app.language
const mapStateToProps = state => {
    return {
        language: (state.app && state.app.language) ? state.app.language : "vi"
    };
};

export default connect(mapStateToProps, null)(IntlProviderWrapper);