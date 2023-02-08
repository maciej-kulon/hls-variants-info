import { expect } from 'chai';
import { afterEach, beforeEach, describe, it } from 'mocha';
import * as sinon from 'sinon';
import { Test } from '@nestjs/testing'
import { HttpClientModule } from '../../src/http-client/http-client.module';
import { HttpClientService } from '../../src/http-client/http-client.service';

describe('HttpClientService', () => {
    let httpClientService: HttpClientService;
    let sandbox: sinon.SinonSandbox;
    
    beforeEach(async () => {
        sandbox = sinon.createSandbox();
        const moduleBuilder = Test.createTestingModule({
            imports: [HttpClientModule],
        });
        const testingModule = await moduleBuilder.compile()
        httpClientService = testingModule.get(HttpClientService);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('calls Got\' get function', async () => {
        const getFunctionSpy = sinon.spy();
        sandbox.stub(httpClientService['httpClient'], 'get').callsFake(getFunctionSpy);
        
        await httpClientService.get('http://some-url.com');

        expect(getFunctionSpy.callCount).to.be.eq(1);
        const args = getFunctionSpy.getCall(0).args;
        expect(args[0]).to.be.eq('http://some-url.com');
    });
});