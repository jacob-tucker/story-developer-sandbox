import { attachTerms } from './code-snippets/attachTerms';
import { claimRevenue } from './code-snippets/claimRevenue';
import { mintLicense } from './code-snippets/mintLicense';
import { registerDerivative } from './code-snippets/registerDerivative';
import { mintAndRegisterNft } from './code-snippets/mintAndRegisterNft';

export type CodeSnippetType = 'register-ipa' | 'attach-terms' | 'mint-license' | 'register-derivative' | 'claim-revenue';

export function loadCodeSnippet(snippetType: CodeSnippetType): string {
  switch (snippetType) {
    case 'register-ipa':
      return mintAndRegisterNft;
    case 'attach-terms':
      return attachTerms;
    case 'mint-license':
      return mintLicense;
    case 'register-derivative':
      return registerDerivative;
    case 'claim-revenue':
      return claimRevenue;
    default:
      return '';
  }
}
