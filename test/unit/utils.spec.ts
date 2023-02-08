import { expect } from 'chai';
import { describe, it } from 'mocha';
import { StringUtils } from '../../src/utils/string-utils';

describe('StringUtils', () => {
    it('replaceAfterLastSlash replaces string after last slash', () => {
        const masterPlaylistUrl = 'http://someurl.com/some/path/to/some/asset/master.m3u8';
        const replacedString = StringUtils.replaceAfterLastSlash(masterPlaylistUrl, '720/stream.m3u8');
        expect(replacedString).to.be.eq('http://someurl.com/some/path/to/some/asset/720/stream.m3u8');
    });
});
